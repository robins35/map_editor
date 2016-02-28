(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _ui = require('./ui');

var successCount = 0;
var errorCount = 0;
var imgs = {};
var imgPaths = [];

var isDone = function isDone() {
    return imgPaths.length == successCount + errorCount;
};

var loadImagePaths = function loadImagePaths(downloadCallback) {
    $.ajax({
        dataType: "json",
        method: "GET",
        url: '/load_textures',
        error: function error(_error) {
            console.log("ERROR: " + _error);
        },
        success: function success(data) {
            imgPaths = data;
            loadImages(downloadCallback);
        }
    });
};

var loadImages = function loadImages(downloadCallback) {
    var progressBar = new _ui.UI.ProgressBar(imgPaths.length);
    window.game.sprites.push(progressBar);

    if (imgPaths.length == 0) downloadCallback();
    for (var i = 0; i < imgPaths.length; i++) {
        (function (src) {
            var name = src.split('/').slice(-1)[0].split('.')[0];imgs[name] = new Image();

            imgs[name].addEventListener("load", function () {
                successCount++;
                progressBar.progress++;
                if (isDone()) downloadCallback();
            }, false);

            imgs[name].addEventListener("error", function () {
                errorCount++;
                console.log("Error loading image " + this.src);
                if (isDone()) downloadCallback();
            }, false);

            imgs[name].src = src;
        })(imgPaths[i]);
    }
};

// var loadAudio = function(downloadCallback) {
//     if(imgPaths.length == 0) downloadCallback();
// }

var loadAssets = function loadAssets(downloadCallback) {
    loadImagePaths(downloadCallback);
};

var getImage = function getImage(name) {
    return imgs[name];
};

exports.loadAssets = loadAssets;
exports.getImage = getImage;
exports.imgs = imgs;

// var getAudio = function(name) {
//     return snds[name];
// }

// module.exports = {
//     loadAssets : loadAssets,
//     getImage : getImage,
//     getAudio : getAudio,
//     imgs : imgs
// };

},{"./ui":6}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = (function () {
  function Entity(x, y) {
    _classCallCheck(this, Entity);

    this.id = Entity.id++;
    this.pos = { x: x, y: y };
    this.canvas = window.game.canvas;
    this.ctx = window.game.ctx;
  }

  Entity.prototype.move = function move(x, y) {
    this.pos = { x: x, y: y };
  };

  return Entity;
})();

exports.Entity = Entity;

Entity.id = 1;

},{}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _asset_manager = require('./asset_manager');

var assetManager = _interopRequireWildcard(_asset_manager);

var _main_menu = require('./main_menu');

var mainMenu = _interopRequireWildcard(_main_menu);

var States = ['loading', 'ready', 'paused', 'menu'];

var SpriteList = (function () {
  function SpriteList() {
    _classCallCheck(this, SpriteList);

    this.list = {};
  }

  SpriteList.prototype.push = function push(sprite) {
    this.list[sprite.id] = sprite;
  };

  SpriteList.prototype.draw = function draw() {
    // Change to a better kind of iterator
    for (var i = 1; i <= Object.keys(this.list).length; i++) {
      this.list[i].draw();
    }
  };

  return SpriteList;
})();

var canvas = undefined;
var ctx = undefined;
var state = 'begin';
var sprites = new SpriteList();
var activeSprites = new SpriteList();
var environmentSprites = new SpriteList();

var update = function update() {
  switch (state) {
    case 'begin':
      exports.state = state = 'loading';
      assetManager.loadAssets(function () {
        exports.state = state = "main_menu";console.log("Loaded assets");
      });
      break;
    case 'main_menu':
      //debugger
      break;
    default:
    //console.log("No state matches in update loop")
  }
};

var draw = function draw() {
  sprites.draw();
};

var init = function init() {
  exports.canvas = canvas = document.getElementById("map_editor");
  exports.ctx = ctx = canvas.getContext("2d");
};

exports.state = state;
exports.sprites = sprites;
exports.canvas = canvas;
exports.ctx = ctx;
exports.update = update;
exports.draw = draw;
exports.init = init;

},{"./asset_manager":1,"./main_menu":5}],4:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _game = require('./game');

var game = _interopRequireWildcard(_game);

window.game = game;

var FPS = 60;

var AnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

$(document).ready(function () {
  game.init();

  if (AnimationFrame) {
    var updateLoop = function updateLoop() {
      game.update();
      AnimationFrame(updateLoop);
    };
    var drawLoop = function drawLoop() {
      game.draw();
      AnimationFrame(drawLoop);
    };

    updateLoop();
    drawLoop();
  } else {
    console.log("Falling back to setInterval, update your browser!");
    setInterval(game.update, 1000 / FPS);
    setInterval(game.draw, 1000 / FPS);
  }
});

},{"./game":3}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _ui = require('./ui');

var buttons = [];
var canvas = undefined;
var ctx = undefined;

var draw = function draw() {
  for (var i = 1; i < buttons.length; i++) {
    buttons[i].draw();
  }
};

var init = function init() {
  canvas = window.game.canvas;
  ctx = window.game.ctx;
  var buttonsWidth = canvas.width / 4;
  var buttonColumnX = canvas.width / 2 - buttonsWidth;
  var buttonsHeight;
  var buttonColumnY = canvas.height / 2;

  exports.buttons = buttons = [new _ui.UI.Button(buttonColumnX, buttonColumnY, buttonsWidth, buttonsHeight, "Map Editor"), new _ui.UI.Button(buttonColumnX, buttonColumnY + 2 * buttonsHeight, buttonsWidth, buttonsHeight, "Settings")];
};

exports.buttons = buttons;
exports.init = init;
exports.draw = draw;

},{"./ui":6}],6:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _entity = require('./entity');

var Button = (function (_Entity) {
  _inherits(Button, _Entity);

  function Button(x, y, width, height, text) {
    _classCallCheck(this, Button);

    _Entity.call(this, x, y);
    this.width = width;
    this.height = height;
    this.text = text;
    this.clicked = false;
    this.hovered = false;
    this.color = "#cccccc";
  }

  Button.prototype.draw = function draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    var fontSize = 20;
    this.ctx.setFillColor(1, 1, 1, 1.0);
    this.ctx.font = fontSize + "px sans-serif";

    var textSize = this.ctx.measureText(this.text);
    var textX = this.x + this.width / 2 - textSize.width / 2;
    var textY = this.y + this.height / 2 - fontSize / 2;

    this.ctx.fillText(this.text, textX, textY);
  };

  return Button;
})(_entity.Entity);

var ProgressBar = (function (_Entity2) {
  _inherits(ProgressBar, _Entity2);

  function ProgressBar(total) {
    _classCallCheck(this, ProgressBar);

    _Entity2.call(this, 200, 200);
    this.total = total;
    this.progress = 0;
    this.width = 300;
    this.height = 20;
    this.color = "#ffffff";
  }

  ProgressBar.prototype.draw = function draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.calculateWidth(), this.height);
  };

  ProgressBar.prototype.calculateWidth = function calculateWidth() {
    return this.width * (this.progress / this.total);
  };

  return ProgressBar;
})(_entity.Entity);

var UI = { Button: Button, ProgressBar: ProgressBar };

exports.UI = UI;

},{"./entity":2}]},{},[4]);
