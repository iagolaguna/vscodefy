'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deactivate = exports.activate = undefined;

require('babel-polyfill');

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

var _vscode = require('vscode');

var _commands = require('./commands/commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function activate(_ref) {
  var subscriptions = _ref.subscriptions;

  var commandsRegistered = [{
    command: 'vscodefy.next',
    action: _commands.next
  }, {
    command: 'vscodefy.previous',
    action: _commands.previous
  }, {
    command: 'vscodefy.play',
    action: _commands.play
  }, {
    command: 'vscodefy.pause',
    action: _commands.pause
  }, {
    command: 'vscodefy.signIn',
    action: _commands.signIn
  }];

  var reference = commandsRegistered.map(function (_ref2) {
    var command = _ref2.command,
        action = _ref2.action;
    return _vscode.commands.registerCommand(command, action);
  });
  subscriptions.push(_vscode.Disposable.from.apply(_vscode.Disposable, _toConsumableArray(reference)));

  var siginStatusBar = _vscode.window.createStatusBarItem(_vscode.StatusBarAlignment.Left, 11);
  siginStatusBar.text = 'Sing In';
  siginStatusBar.command = 'vscodefy.signIn';
  siginStatusBar.tooltip = 'Entrar no Spotify';
  siginStatusBar.show();

  _pubsubJs2.default.subscribe('signIn', function () {
    console.log('signIn called');
    siginStatusBar.hide();
    siginStatusBar.dispose();
    var StatusBarButtons = buttonsInfo.map(function (_ref3) {
      var text = _ref3.text,
          priority = _ref3.priority,
          buttonCommand = _ref3.buttonCommand,
          tooltip = _ref3.tooltip;

      var status = _vscode.window.createStatusBarItem(_vscode.StatusBarAlignment.Left, priority);
      status.text = text;
      status.command = buttonCommand;
      status.tooltip = tooltip;
      status.show();
      return status;
    });
    subscriptions.push(StatusBarButtons);
  });
  // subscriptions.push(StatusBarButtons);
  // subscriptions.push(Disposable.from(...reference));
}

// this method is called when your extension is deactivated
function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;


var buttonsInfo = [{
  id: 'next',
  text: '$(chevron-right)',
  priority: 8,
  tooltip: 'Next',
  buttonCommand: 'vscodefy.next'
}, {
  id: 'play',
  text: '$(triangle-right)',
  priority: 9,
  tooltip: 'Play',
  buttonCommand: 'vscodefy.play'
}, {
  id: 'pause',
  text: '$(primitive-square)',
  priority: 10,
  tooltip: 'Pause',
  buttonCommand: 'vscodefy.pause'
}, {
  id: 'previous',
  text: '$(chevron-left)',
  priority: 11,
  tooltip: 'Previoues',
  buttonCommand: 'vscodefy.previous'
}];
//# sourceMappingURL=extension.js.map