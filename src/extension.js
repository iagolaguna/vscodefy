import 'babel-polyfill'
import PubSub from 'pubsub-js'
import { window, commands, Disposable, StatusBarAlignment } from 'vscode'
import { play, pause, next, previous, signIn, getCode } from './commands/commands'
import axios from 'axios'
import axiosConfig from './axios-config'

function activate (context) {
  axiosConfig()

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
    }
  ]

  const reference = commandsRegistered
    .map(({ command, action }) => commands.registerCommand(command, action))
  context.subscriptions.push(Disposable.from(...reference))

  const siginStatusBar = window.createStatusBarItem(StatusBarAlignment.Left, 11)
  siginStatusBar.text = 'Sing In'
  siginStatusBar.command = 'vscodefy.signIn'
  siginStatusBar.tooltip = 'Entrar no Spotify'
  siginStatusBar.show()

  PubSub.subscribe('signIn', (message, data) => {
    context.globalState.update('cache', data)
    const { token_type: tokenType, access_token: accessToken } = data
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
    context.subscriptions.push(StatusBarButtons)
  })
  const cache = context.globalState.get('cache')
  if (cache && cache !== {}) {
    PubSub.publish('signIn', cache)
  }
}

// this method is called when your extension is deactivated
function deactivate () {
}

export {
  activate,
  deactivate
}

const buttonsInfo = [
  {
    id: 'next',
    text: '$(chevron-right)',
    priority: 8,
    tooltip: 'Next',
    buttonCommand: 'vscodefy.next'
  },
  {
    id: 'play',
    text: '$(triangle-right)',
    priority: 9,
    tooltip: 'Play',
    buttonCommand: 'vscodefy.play'
  },
  {
    id: 'pause',
    text: '$(primitive-square)',
    priority: 10,
    tooltip: 'Pause',
    buttonCommand: 'vscodefy.pause'
  },
  {
    id: 'previous',
    text: '$(chevron-left)',
    priority: 11,
    tooltip: 'Previoues',
    buttonCommand: 'vscodefy.previous'
  }
]
