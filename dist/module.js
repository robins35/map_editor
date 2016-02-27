(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _progress_bar = require('./progress_bar');

var ctx = 0;
var sprites = 0;

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
            //console.log(`Loaded image paths: ${data}`)
            imgPaths = data;
            loadImages(downloadCallback);
        }
    });
};

var loadImages = function loadImages(downloadCallback) {
    var progressBar = new _progress_bar.ProgressBar(ctx, imgPaths.length);
    sprites.push(progressBar);

    if (imgPaths.length == 0) downloadCallback();
    for (var i = 0; i < imgPaths.length; i++) {
        (function (src) {
            var name = src.split('/').slice(-1)[0].split('.')[0];imgs[name] = new Image();

            imgs[name].addEventListener("load", function () {
                successCount++;
                //console.log(`Loaded image ${this.src}`)
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

var loadAssets = function loadAssets(downloadCallback, _ctx, _sprites) {
    ctx = _ctx;
    sprites = _sprites;
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

},{"./progress_bar":5}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = (function () {
  function Entity(ctx, x, y) {
    _classCallCheck(this, Entity);

    this.ctx = ctx;
    this.id = Entity.id++;
    this.pos = { x: x, y: y };
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
      }, ctx, sprites);
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
exports.canvas = canvas;
exports.ctx = ctx;
exports.update = update;
exports.draw = draw;
exports.init = init;

},{"./asset_manager":1}],4:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _game = require('./game');

var game = _interopRequireWildcard(_game);

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _entity = require('./entity');

var ProgressBar = (function (_Entity) {
  _inherits(ProgressBar, _Entity);

  function ProgressBar(ctx, total) {
    _classCallCheck(this, ProgressBar);

    _Entity.call(this, ctx, 200, 200);
    this.total = total;
    this.progress = 0;
    this.width = 300;
    this.height = 40;
    this.color = "white";
  }

  ProgressBar.prototype.draw = function draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.color;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.calculateWidth(), this.height);
  };

  ProgressBar.prototype.calculateWidth = function calculateWidth() {
    return this.width * (this.progress / this.total);
  };

  return ProgressBar;
})(_entity.Entity);

exports.ProgressBar = ProgressBar;

},{"./entity":2}]},{},[4]);
