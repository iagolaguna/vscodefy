import * as vscode from 'vscode';
import { Observable, Subscriber } from "rxjs";

export function fromCommand(command: string): Observable<void> {
	return new Observable(subscriber => {
		function handler() {
			subscriber.next();
		}
		setupSubscription(command, handler, subscriber);
	});
}

function setupSubscription(command: string, handler: (...args: any[]) => void, subscriber: Subscriber<void>) {
	const { dispose: unsubscribe } = vscode.commands.registerCommand(command, handler);
	subscriber.add(unsubscribe);
}