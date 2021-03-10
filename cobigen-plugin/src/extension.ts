import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
const os = require('os');

// this method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('cobigen.generate', (e) => {
		let selectedFile = e.fsPath;
		let terminal = vscode.window.createTerminal();
		terminal.show();

		let selectedFileString = (new String(selectedFile)).valueOf().replace(/\\/g, "/");
        let devonScriptFile = getDevonScriptFile();
		let cmd = (devonScriptFile == "")
			? "devon cobigen generate " + selectedFileString
            : devonScriptFile + " cobigen generate " + selectedFileString;

        if(process.platform == "win32") {
            terminal.sendText("cmd");
        }
        setTimeout(() => {
            terminal.sendText(cmd);
        }, 1000);
	});

	context.subscriptions.push(disposable);
}

function getDevonScriptFile() {
	let env = process.env;

    if(env.DEVON_IDE_HOME && fs.existsSync(path.join(env.DEVON_IDE_HOME, "scripts", "devon"))) {
        return path.join(env.DEVON_IDE_HOME, "scripts", "devon");
    } else {
        let homeDirectory = os.homedir();
        let homeFile = path.join(homeDirectory, ".devon", "home");
        if(fs.existsSync(homeFile)) {
            let content = fs.readFileSync(homeFile, "utf-8");
            let lines = content.split("\n");
            for(let i = 0; i < lines.length; i++) {
                let home = lines[i].split("=");
                if(home.length == 2 && home[0] == "DEVON_IDE_HOME") {
                    let ideHomePath = home[1];
                    if(process.platform == "win32" && ideHomePath.startsWith("/")) {
                        ideHomePath = path.join(ideHomePath.charAt(1) + ":\\" + ideHomePath.substring(3));
                    }
                    
                    if(fs.existsSync(ideHomePath) && fs.existsSync(path.join(ideHomePath, "scripts", "devon"))) {
                        return path.join(ideHomePath, "scripts", "devon");
                    }
                }
            }
        }
	}
	
	return "";
}

// this method is called when the extension is deactivated
export function deactivate() {}
