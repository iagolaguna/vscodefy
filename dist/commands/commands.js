'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signIn = exports.play = exports.pause = exports.next = exports.previous = undefined;

var next = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _axios2.default.post(spotifyUrl + '/next', {}, {
              headers: {
                'Authorization': totalToken
              }
            });

          case 3:
            _pubsubJs2.default.publish('next', null);
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6]]);
  }));

  return function next() {
    return _ref.apply(this, arguments);
  };
}();

var previous = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _axios2.default.post(spotifyUrl + '/previous', {}, {
              headers: {
                'Authorization': totalToken
              }
            });

          case 3:
            _pubsubJs2.default.publish('previous', null);
            _context2.next = 9;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2['catch'](0);

            console.log(_context2.t0);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 6]]);
  }));

  return function previous() {
    return _ref2.apply(this, arguments);
  };
}();

var pause = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _axios2.default.put(spotifyUrl + '/pause', {}, {
              headers: {
                'Authorization': totalToken
              }
            });

          case 3:
            _pubsubJs2.default.publish('pause', null);
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3['catch'](0);

            console.log(_context3.t0);

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 6]]);
  }));

  return function pause() {
    return _ref3.apply(this, arguments);
  };
}();

var play = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _axios2.default.put(spotifyUrl + '/play', {}, {
              headers: {
                'Authorization': totalToken
              }
            });

          case 3:
            _pubsubJs2.default.publish('play', null);
            _context4.next = 9;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4['catch'](0);

            console.log(_context4.t0);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 6]]);
  }));

  return function play() {
    return _ref4.apply(this, arguments);
  };
}();

var signIn = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var data;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _vscode.commands.executeCommand('vscode.open', _vscode.Uri.parse('https://vscodefy.netlify.com'));

          case 2:
            data = _context5.sent;

            console.log(data);
            _pubsubJs2.default.publish('signIn', null);

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function signIn() {
    return _ref5.apply(this, arguments);
  };
}();

var _vscode = require('vscode');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var token = 'BQCi7H5G_gWYBYP1-iJLtpaOWNeAWdXPqCTxtItro5YlEGytuP9Ywo3WOEpYP-R9rzdAmp4zd0Zi2Lpt1K9tp07SJvJT0yuHWHG4dRd1w0bSy_PJ_igcpKqEJF_QhymaE6p5W5h4TMU58OhOTH6oS-Z4inmDfPiNN-mM';
var prefix = 'Bearer';
var totalToken = prefix + ' ' + token;
var spotifyUrl = 'https://api.spotify.com/v1/me/player';

exports.previous = previous;
exports.next = next;
exports.pause = pause;
exports.play = play;
exports.signIn = signIn;
//# sourceMappingURL=commands.js.map