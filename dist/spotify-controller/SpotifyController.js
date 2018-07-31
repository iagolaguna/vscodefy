'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpotifyController = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var token = 'BQClLd2yKQ_Jn-TY9lPHaxZo8U4YZ3WUxeS7H6Y4fjYBOENLq_lvP-UOBKlbl6kKlwIDKNYn-ahhgGsdYUtHzBJDDTPJRm8i6hB4gefS55SKb8-mi2yG3mGaVlGdMFFKxGwMiguzHmTjqX44eGxBf1084NQ-eZDYjIwc"';
var prefix = 'Bearer';
var totalToken = prefix + ' ' + token;
var spotifyUrl = 'https://api.spotify.com/v1/me/player';

var SpotifyController = exports.SpotifyController = function () {
  function SpotifyController() {
    _classCallCheck(this, SpotifyController);
  }

  _createClass(SpotifyController, [{
    key: 'next',
    value: function next() {
      try {
        _axios2.default.post(spotifyUrl + '/next', {}, {
          headers: {
            'Authorization': totalToken
          }
        }).then(function (response) {
          console.log(response);
        }).catch(function (err) {
          console.log(err);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'previous',
    value: function previous() {
      try {
        _axios2.default.post(spotifyUrl + '/previous', {}, {
          headers: {
            'Authorization': totalToken
          }
        }).then(function (response) {
          console.log(response);
        }).catch(function (err) {
          console.log(err);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      try {
        _axios2.default.put(spotifyUrl + '/pause', {}, {
          headers: {
            'Authorization': totalToken
          }
        }).then(function (response) {
          console.log(response);
        }).catch(function (err) {
          console.log(err);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, {
    key: 'play',
    value: function play() {
      try {
        _axios2.default.put(spotifyUrl + '/play', {}, {
          headers: {
            'Authorization': totalToken
          }
        }).then(function (response) {
          console.log(response);
        }).catch(function (err) {
          console.log(err);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }]);

  return SpotifyController;
}();
//# sourceMappingURL=SpotifyController.js.map