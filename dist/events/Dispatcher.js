'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DispatcherEvent = require('./DispatcherEvent');

var _DispatcherEvent2 = _interopRequireDefault(_DispatcherEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dispatcher = function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    this.events = {};
  }

  _createClass(Dispatcher, [{
    key: 'dispatch',
    value: function dispatch(eventName, data) {
      var event = this.events[eventName];
      if (event) {
        event.emit(data);
      }
    }
  }, {
    key: 'on',
    value: function on(eventName, callback) {
      var event = this.events[eventName];
      if (!event) {
        event = new _DispatcherEvent2.default(eventName);
        this.events[eventName] = event;
      }
      event.registerCallback(callback);
    }
  }, {
    key: 'off',
    value: function off(eventName, callback) {
      var event = this.events[eventName];
      if (event && event.callbacks.find(callback)) {
        event.unregisterCallback(callback);
        if (event.callbacks.length === 0) {
          delete this.events[eventName];
        }
      }
    }
  }]);

  return Dispatcher;
}();

exports.default = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map