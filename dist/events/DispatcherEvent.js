"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DispatcherEvent = function () {
  function DispatcherEvent(eventName) {
    _classCallCheck(this, DispatcherEvent);

    this.eventName = eventName;
    this.callbacks = [];
  }

  _createClass(DispatcherEvent, [{
    key: "registerCallback",
    value: function registerCallback(callback) {
      this.callbacks.push(callback);
    }
  }, {
    key: "unregisterCallback",
    value: function unregisterCallback(callback) {
      var index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    }
  }, {
    key: "emit",
    value: function emit(data) {
      var callbacks = [].concat(_toConsumableArray(this.callbacks));
      callbacks.forEach(function (callback) {
        callback(data);
      });
    }
  }]);

  return DispatcherEvent;
}();

exports.default = DispatcherEvent;
//# sourceMappingURL=DispatcherEvent.js.map