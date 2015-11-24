import * as vscode from 'vscode'; 
import * as convertBase from './changeBaseCommands';

export function activate(context: vscode.ExtensionContext) {
	var disposable = vscode.commands.registerCommand('extension.baseConverter.decimalToBinary', convertBase.decimalToBinaryCommand);
	var disposable = vscode.commands.registerCommand('extension.baseConverter.binaryToDecimal', convertBase.binaryToDecimalCommand);
	var disposable = vscode.commands.registerCommand('extension.baseConverter.anyToAny', convertBase.anyToAnyCommand);
	
	context.subscriptions.push(disposable);
}