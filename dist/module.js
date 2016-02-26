(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;
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
            console.log("ERROR: #{error}");
        },
        success: function success(data) {
            imgPaths = data;
            downloadCallback();
        }
    });
};

var loadImages = function loadImages(downloadCallback) {
    if (imgPaths.length == 0) downloadCallback();
    for (var i = 0; i < imgPaths.length; i++) {
        (function (src) {
            var name = src.split('/').slice(-1)[0].split('.')[0];
            imgs[name] = new Image();

            imgs[name].addEventListener("load", function () {
                successCount++;
                if (isDone()) downloadCallback();
            }, false);

            imgs[name].addEventListener("error", function () {
                errorCount++;
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

exports.loadAssets = loadAssets;
// var getImage = function(name) {
//     return imgs[name];
// }

// var getAudio = function(name) {
//     return snds[name];
// }

// module.exports = {
//     loadAssets : loadAssets,
//     getImage : getImage,
//     getAudio : getAudio,
//     imgs : imgs
// };

},{}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var state = 'loading';

exports.state = state;
var update = function update() {
  //console.log("Updating");
};

exports.update = update;
var draw = function draw() {
  //console.log("Drawing");
};
exports.draw = draw;

},{}],3:[function(require,module,exports){
'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _game = require('./game');

var game = _interopRequireWildcard(_game);

var _asset_manager = require('./asset_manager');

var assetManager = _interopRequireWildcard(_asset_manager);

var FPS = 60;

var AnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

$(document).ready(function () {
  if (AnimationFrame) {
    var updateLoop = function updateLoop() {
      game.update();
      AnimationFrame(updateLoop);
    };
    var drawLoop = function drawLoop() {
      game.draw();
      AnimationFrame(drawLoop);
    };

    assetManager.loadAssets(function () {
      game.state = "ready";console.log("Loaded assets");
    });
    updateLoop();
    drawLoop();
  } else {
    console.log("Falling back to setInterval, update your browser!");
    setInterval(game.update, 1000 / FPS);
    setInterval(game.draw, 1000 / FPS);
  }
});

},{"./asset_manager":1,"./game":2}]},{},[3]);
