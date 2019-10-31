import * as vscode from 'vscode'
import axios from 'axios'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { fromCommand } from './utils/rxjs'
import { authorize, getAvailableDevices } from './service/api'
import { isLogged, getAuthContentFromData } from './utils/token'
import { VSCODEFY_CACHE, SPOTIFY_PLAYER_URL } from './utils/constant'
import { AuthDataSplited, AuthData } from './types'

const unsubscribe$ = new Subject<void>()

export function activate(context: vscode.ExtensionContext) {
	console.log('Vscodefy actived')
	console.log(context)
	const cache: AuthData | undefined = context.globalState.get(VSCODEFY_CACHE) || {}
	const { tokenType, accessToken } = cache
	axios.defaults.headers.common['Authorization'] = `${tokenType} ${accessToken}`

	fromCommand('extension.helloWorld')
		.pipe(takeUntil(unsubscribe$))
		.subscribe(() => {
			vscode.window.showInformationMessage('Hello World!')
		});

	fromCommand('vscodefy.getCode')
		.pipe(takeUntil(unsubscribe$))
		.subscribe(async () => {
			const code = await vscode.window.showInputBox()
			// if (!code || isLogged(<AuthDataSplited>context.globalState.get(VSCODEFY_CACHE))) {
			if (!code) {
				return
			}
			const { data } = await authorize(code)
			const authContent = getAuthContentFromData(data)
			context.globalState.update(VSCODEFY_CACHE, authContent)
			const { tokenType, accessToken } = authContent
			axios.defaults.headers.common['Authorization'] = `${tokenType} ${accessToken}`
			if (data.statusCode) {
				vscode.window.showErrorMessage('Spotify OAuth Code is wrong');
				return;
			}
		});

	fromCommand('vscodefy.pickDevice')
		.pipe(takeUntil(unsubscribe$))
		.subscribe(pickDevice)

	fromCommand('vscodefy.play')
		.pipe(takeUntil(unsubscribe$))
		.subscribe(async () => {
			try {
				await axios.put(`${SPOTIFY_PLAYER_URL}/play`, {})
			} catch (error) {
				console.error(error);
			}
		})
}

const pickDevice = async (): Promise<boolean> => {
	const deviceNotFound = async () => { await vscode.window.showInformationMessage('Not found any available device, please connect on spotify in someone device') }
	const devices: [{ name: string, id: string }] = await getAvailableDevices()

	if (!devices.length) {
		await deviceNotFound()
		return false
	}
	const deviceNames = devices.map(({ name }) => name)
	const deviceSelected = await vscode.window.showQuickPick(deviceNames)
	const device = devices.find(({ name }) => name === deviceSelected)
	if (!device) {
		return false
	}
	if (!device.id) {
		await deviceNotFound()
		return false
	}
	await axios.put(SPOTIFY_PLAYER_URL, { 'device_ids': [device.id] })
	return true
}

export function deactivate() {
	unsubscribe$.unsubscribe();
}
