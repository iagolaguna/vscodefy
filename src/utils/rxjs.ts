import * as vscode from 'vscode';
import { Observable, Subscriber } from "rxjs";

export function fromCommand<T>(command: string): Observable<T> {
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