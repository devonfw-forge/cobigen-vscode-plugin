import * as vscode from 'vscode';

// this method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('cobigen.generate', (e) => {
		let selectedFile = e.fsPath;
		let terminal = vscode.window.createTerminal();
		terminal.show();

		let selectedFileString = (new String(selectedFile)).valueOf().replace(/\\/g, "/");
		terminal.sendText("devon cobigen generate " + selectedFileString);
	});

	context.subscriptions.push(disposable);
}

// this method is called when the extension is deactivated
export function deactivate() {}
