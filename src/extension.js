import 'babel-polyfill'
import axios from 'axios'
import PubSub from 'pubsub-js'
import axiosConfig from './axios-config'
import { window, commands, Disposable, StatusBarAlignment } from 'vscode'
import { play, pause, next, previous, login, getCode, getCurrentTrackAsync, pickDevice } from './commands/commands'
import { getAuthContentFromData, validCache } from './utils'
import { VSCODEFY_CACHE } from './constant'

let refreshStatusId
let allStatusBar
let loginStatusBar
let configureStatusBar
export function deactivate () {
  logout()
}

function logout () {
  if (!validCache(this.globalState.get(VSCODEFY_CACHE))) {
    return
  }
  clearInterval(refreshStatusId)
  this.globalState.update(VSCODEFY_CACHE, null)
  allStatusBar.map(status => status.dispose())
  const initialButtons = createInitialButtons()
  loginStatusBar = initialButtons.loginStatusBar
  configureStatusBar = initialButtons.configureStatusBar
  this.subscriptions.push(Disposable.from(loginStatusBar, configureStatusBar))
}

export function activate (context) {
  axiosConfig(context)

  const reference = commandsRegistered
    .map(({ command, action }) => commands.registerCommand(command, action, context))

  const initialButtons = createInitialButtons()
  loginStatusBar = initialButtons.loginStatusBar
  configureStatusBar = initialButtons.configureStatusBar
  PubSub.subscribe('signIn', (message, data) => {
    const authContent = getAuthContentFromData(data)
    context.globalState.update(VSCODEFY_CACHE, authContent)
    setup(authContent, context)
  })

  context.subscriptions.push(Disposable.from(...reference, loginStatusBar, configureStatusBar))
  const cache = context.globalState.get(VSCODEFY_CACHE)
  if (validCache(cache)) {
    setup(cache, context)
  }
}

function setup (authContent, context) {
  const { tokenType, accessToken } = authContent
  axios.defaults.headers.common['Authorization'] = `${tokenType} ${accessToken}`

  loginStatusBar.dispose()
  configureStatusBar.dispose()
  const StatusBarButtons = buttonsInfo
    .map(({ text, priority, buttonCommand, tooltip }) => {
      const status = window.createStatusBarItem(StatusBarAlignment.Left, priority)
      status.text = text
      status.command = buttonCommand
      status.tooltip = tooltip
      status.show()
      return status
    })
  const statusCurrentMusic = window.createStatusBarItem(StatusBarAlignment.Left, 7)
  statusCurrentMusic.text = 'Current Music'
  statusCurrentMusic.tooltip = 'Current Music'
  statusCurrentMusic.hide()

  const pauseButton = StatusBarButtons.find(({ command }) => command === 'vscodefy.pause')
  const playButton = StatusBarButtons.find(({ command }) => command === 'vscodefy.play')
  const switchStatusButton = (isPlaying) => {
    if (isPlaying) {
      playButton.hide()
      pauseButton.show()
    } else {
      pauseButton.hide()
      playButton.show()
    }
  }
  PubSub.subscribe('current-track', (message, { name = undefined, isPlaying = false }) => {
    statusCurrentMusic.text = name ? `$(unmute)  ${name}` : ''
    statusCurrentMusic.tooltip = name || ''
    statusCurrentMusic.show()
    switchStatusButton(isPlaying)
  })
  PubSub.publishSync('current-track', {})

  refreshStatusId = setInterval(() => getCurrentTrackAsync(), 10000)
  allStatusBar = [...StatusBarButtons, statusCurrentMusic]
  context.subscriptions.push(Disposable.from(...allStatusBar))
}

function createInitialButtons () {
  const loginStatusBar = createStatusBarItem({ priority: 11, text: '$(sign-in) Login', command: 'vscodefy.login', tooltip: 'Login on Spotify' })
  const configureStatusBar = createStatusBarItem({ priority: 10, text: '$(gear) Configure', command: 'vscodefy.getCode', tooltip: 'Configure OAuth Spotify Code' })
  return { loginStatusBar, configureStatusBar }
}

function createStatusBarItem ({ priority, text, command, tooltip }) {
  const statusBar = window.createStatusBarItem(StatusBarAlignment.Left, priority)
  statusBar.text = text
  statusBar.command = command
  statusBar.tooltip = tooltip
  statusBar.show()
  return statusBar
}
const buttonsInfo = [
  {
    id: 'next',
    text: ' $(chevron-right) ',
    priority: 8,
    tooltip: 'Next',
    buttonCommand: 'vscodefy.next'
  },
  {
    id: 'play',
    text: ' $(triangle-right) ',
    priority: 9,
    tooltip: 'Play',
    buttonCommand: 'vscodefy.play'
  },
  {
    id: 'pause',
    text: ' $(primitive-square) ',
    priority: 10,
    tooltip: 'Pause',
    buttonCommand: 'vscodefy.pause'
  },
  {
    id: 'previous',
    text: ' $(chevron-left) ',
    priority: 11,
    tooltip: 'Previous',
    buttonCommand: 'vscodefy.previous'
  }
]

const commandsRegistered = [
  {
    command: 'vscodefy.next',
    action: next
  },
  {
    command: 'vscodefy.previous',
    action: previous
  },
  {
    command: 'vscodefy.play',
    action: play
  },
  {
    command: 'vscodefy.pause',
    action: pause
  },
  {
    command: 'vscodefy.login',
    action: login
  },
  {
    command: 'vscodefy.getCode',
    action: getCode
  },
  {
    command: 'vscodefy.pickDevice',
    action: pickDevice
  },
  {
    command: 'vscodefy.logout',
    action: logout
  }
]
