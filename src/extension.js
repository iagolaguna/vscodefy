import 'babel-polyfill'
import PubSub from 'pubsub-js'
import { window, commands, Disposable, StatusBarAlignment } from 'vscode'
import { play, pause, next, previous, signIn, getCode, getCurrentTrackAsync, pickDevice } from './commands/commands'
import { getAuthContentFromData, validCache } from './utils'
import axios from 'axios'
import axiosConfig from './axios-config'

let refreshStatusId

// this method is called when your extension is deactivated
function deactivate () {
  clearInterval(refreshStatusId)
}
function activate (context) {
  axiosConfig(context)

  const reference = commandsRegistered
    .map(({ command, action }) => commands.registerCommand(command, action))
  context.subscriptions.push(Disposable.from(...reference))

  const siginStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 11)
  siginStatusBar.text = 'Sing In'
  siginStatusBar.command = 'vscodefy.signIn'
  siginStatusBar.tooltip = 'Entrar no Spotify'
  siginStatusBar.show()

  PubSub.subscribe('signIn', (message, data) => {
    const authContent = getAuthContentFromData(data)
    context.globalState.update('cache', authContent)
    // axios.defaults.headers.common['Authorization'] = 'Bearer BQCTwUN8NgygotO4UGWPG7G9yz8KNs5VCcXaG5540e0dz39HBgMH-bDY2kZcI7OAvJtGGASDOHDC-BzH9EQSyibebCOXJHRYX1ygjL6xqcek_xRtTEaBK-atMpNTqWfmTuz9twFVxcmg6SozPPtjOegZ3jNvnW2fKwfR'
    setup(authContent, siginStatusBar, context)
  })

  const cache = context.globalState.get('cache')
  if (validCache(cache)) {
    setup(cache, siginStatusBar, context)
  }
}

function setup (authContent, siginStatusBar, context) {
  const { tokenType, accessToken } = authContent
  // axios.defaults.headers.common['Authorization'] = 'Bearer BQCTwUN8NgygotO4UGWPG7G9yz8KNs5VCcXaG5540e0dz39HBgMH-bDY2kZcI7OAvJtGGASDOHDC-BzH9EQSyibebCOXJHRYX1ygjL6xqcek_xRtTEaBK-atMpNTqWfmTuz9twFVxcmg6SozPPtjOegZ3jNvnW2fKwfR'
  axios.defaults.headers.common['Authorization'] = `${tokenType} ${accessToken}`
  siginStatusBar.hide()
  siginStatusBar.dispose()
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
  PubSub.subscribe('current-track', (message, data) => {
    const { name, isPlaying } = data
    statusCurrentMusic.text = `$(unmute)  ${name}`
    statusCurrentMusic.tooltip = name
    statusCurrentMusic.show()
    switchStatusButton(isPlaying)
  })
  context.subscriptions.push(StatusBarButtons)
  refreshStatusId = setInterval(() => getCurrentTrackAsync(), 5000)
}
export {
  activate,
  deactivate
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
    command: 'vscodefy.signIn',
    action: signIn
  },
  {
    command: 'vscodefy.getCode',
    action: getCode
  },
  {
    command: 'vscodefy.pickDevice',
    action: pickDevice
  }
]
