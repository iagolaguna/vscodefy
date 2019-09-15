// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Observable, Subscriber, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const unsubscribe$ = new Subject<void>();
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Vscodefy actived');
	console.log(context);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// });
	fromCommand<any>('extension.helloWorld')
		.pipe(takeUntil(unsubscribe$))
		.subscribe(() => {
			vscode.window.showInformationMessage('Hello World!');
		});
}

// this method is called when your extension is deactivated
export function deactivate() {
	unsubscribe$.unsubscribe();
}


function fromCommand<T>(command: string): Observable<T> {
	return new Observable<T>(subscriber => {
		function handler(e: T) {
			subscriber.next(e);
		}
		setupSubscription<T>(command, handler, subscriber);
	});
}

function setupSubscription<T>(command: string, handler: (...args: any[]) => void, subscriber: Subscriber<T>) {
	const { dispose: unsubscribe } = vscode.commands.registerCommand(command, handler);
	subscriber.add(unsubscribe);
}