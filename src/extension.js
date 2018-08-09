import 'babel-polyfill'
import PubSub from 'pubsub-js'
import { window, commands, Disposable, StatusBarAlignment } from 'vscode'
import { play, pause, next, previous, login, getCode, getCurrentTrackAsync, pickDevice } from './commands/commands'
import { getAuthContentFromData, validCache } from './utils'
import axios from 'axios'
import axiosConfig from './axios-config'

let refreshStatusId
let allStatusBar
let loginStatusBar
let configureStatusBar
function logout () {
  if (!validCache(this.globalState.get('cache'))) {
    return
  }
  clearInterval(refreshStatusId)
  this.globalState.update('cache', null)
  allStatusBar.map(status => status.dispose())
  loginStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 11)
  loginStatusBar.text = '$(sign-in) Login'
  loginStatusBar.command = 'vscodefy.login'
  loginStatusBar.tooltip = 'Login on Spotify'
  loginStatusBar.show()
  configureStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 10)
  configureStatusBar.text = '$(gear) Configure'
  configureStatusBar.command = 'vscodefy.getCode'
  configureStatusBar.tooltip = 'Configure OAuth Spotify Code'
  configureStatusBar.show()
  this.subscriptions.push(Disposable.from(loginStatusBar, configureStatusBar))
}

function activate (context) {
  axiosConfig(context)

  const reference = commandsRegistered
    .map(({ command, action }) => commands.registerCommand(command, action, context))

  loginStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 11)
  loginStatusBar.text = '$(sign-in) Login'
  loginStatusBar.command = 'vscodefy.login'
  loginStatusBar.tooltip = 'Login on Spotify'
  loginStatusBar.show()

  configureStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 10)
  configureStatusBar.text = '$(gear) Configure'
  configureStatusBar.command = 'vscodefy.getCode'
  configureStatusBar.tooltip = 'Configure OAuth Spotify Code'
  configureStatusBar.show()

  PubSub.subscribe('signIn', (message, data) => {
    const authContent = getAuthContentFromData(data)
    context.globalState.update('cache', authContent)
    setup(authContent, context)
  })

  context.subscriptions.push(Disposable.from(...reference, loginStatusBar, configureStatusBar))
  const cache = context.globalState.get('cache')
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

  refreshStatusId = setInterval(() => getCurrentTrackAsync(), 5000)
  allStatusBar = [...StatusBarButtons, statusCurrentMusic]
  context.subscriptions.push(Disposable.from(...allStatusBar))
}
export {
  activate
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
