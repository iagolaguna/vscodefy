import * as vscode from 'vscode';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fromCommand } from './utils/rxjs';
import { authorize } from './service/api';
import { isLogged, getAuthContentFromData } from './utils/token';
import { VSCODEFY_CACHE } from './utils/constant';
import { AuthDataSplited } from './types';

const unsubscribe$ = new Subject<void>();

export function activate(context: vscode.ExtensionContext) {
	console.log('Vscodefy actived');
	console.log(context);

	fromCommand<void>('extension.helloWorld')
		.pipe(takeUntil(unsubscribe$))
		.subscribe(() => {
			vscode.window.showInformationMessage('Hello World!')
		});

	fromCommand<void>('vscodefy.getCode')
		.pipe(takeUntil(unsubscribe$))
		.subscribe(async () => {
			const code = await vscode.window.showInputBox();
			if (!code || isLogged(<AuthDataSplited>context.globalState.get(VSCODEFY_CACHE))) {
				return;
			}
			const { data } = await authorize(code);
			const authContent = getAuthContentFromData(data)
			context.globalState.update(VSCODEFY_CACHE, authContent)

			if (data.statusCode) {
				vscode.window.showErrorMessage('Spotify OAuth Code is wrong');
				return;
			}
		});

	fromCommand<void>('vscodefy.pickDevice')
		.pipe(takeUntil(unsubscribe$))
		.subscribe(async () => {
			
		});
}

export function deactivate() {
	unsubscribe$.unsubscribe();
}
