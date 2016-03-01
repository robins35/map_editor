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
    Game.sprites.push(progressBar);

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

},{"./ui":11}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var intersects = function intersects(obj, point) {
  var tolerance = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var xIntersect = point.x + tolerance > obj.pos.x && point.x - tolerance < obj.pos.x + obj.width;
  var yIntersect = point.y + tolerance > obj.pos.y && point.y - tolerance < obj.pos.y + obj.height;
  return xIntersect && yIntersect;
};

exports.intersects = intersects;

},{}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = (function () {
  function Entity(x, y) {
    _classCallCheck(this, Entity);

    this.id = Entity.id++;
    this.pos = { x: x, y: y };
    this.canvas = Game.canvas;
    this.ctx = Game.ctx;
  }

  Entity.prototype.move = function move(x, y) {
    this.pos = { x: x, y: y };
  };

  return Entity;
})();

exports.Entity = Entity;

Entity.id = 1;

},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var mouse = {
  x: 0,
  y: 0,
  clicked: false,
  down: false
};

var keysDown = {};

var init = function init(canvas) {
  $(canvas).on('mousemove', function (e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    mouse.clicked = e.which == 1 && !mouse.down;
    mouse.down = e.which == 1;
  });

  $(canvas).on('mousedown', function (e) {
    mouse.clicked = !mouse.down;
    mouse.down = true;
  });

  $(canvas).on('mouseup', function (e) {
    mouse.down = false;
    mouse.clicked = false;
  });

  $(document).on('keydown', function (e) {
    keysDown[e.keyCode] = true;
  });

  $(document).on('keyup', function (e) {
    delete keysDown[e.keyCode];
  });
};

exports.init = init;
exports.mouse = mouse;
exports.keysDown = keysDown;

},{}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _sprite_list = require('./sprite_list');

var _events = require('./events');

var Events = _interopRequireWildcard(_events);

var _asset_manager = require('./asset_manager');

var AssetManager = _interopRequireWildcard(_asset_manager);

var _main_menu = require('./main_menu');

var MainMenu = _interopRequireWildcard(_main_menu);

var _map_editor = require('./map_editor');

var MapEditor = _interopRequireWildcard(_map_editor);

var States = ['loading', 'ready', 'paused', 'menu'];

var canvas = undefined;
var ctx = undefined;
var events = Events;
var state = 'begin';
var sprites = new _sprite_list.SpriteList();
var activeSprites = new _sprite_list.SpriteList();
var environmentSprites = new _sprite_list.SpriteList();

var update = function update() {
  switch (state) {
    case 'begin':
      state = 'idle';
      AssetManager.loadAssets(function () {
        state = "load_main_menu";
        console.log("Loaded assets");
        sprites.clear();
      });
      break;
    case 'load_main_menu':
      state = 'main_menu';
      MainMenu.init();
      break;
    case 'main_menu':
      sprites.update();
      break;
    case 'load_map_editor':
      state = 'map_editor';
      MapEditor.init();
      break;
    case 'map_editor':
      sprites.update();
      break;
    default:
    //console.log("No state matches in update loop")
  }
};

var draw = function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sprites.draw();
};

var setState = function setState(_state) {
  state = _state;
};

var init = function init() {
  exports.canvas = canvas = document.getElementById("map_editor");
  exports.ctx = ctx = canvas.getContext("2d");
  events.init(canvas);
};

exports.setState = setState;
exports.sprites = sprites;
exports.canvas = canvas;
exports.ctx = ctx;
exports.events = events;
exports.update = update;
exports.draw = draw;
exports.init = init;

},{"./asset_manager":1,"./events":4,"./main_menu":7,"./map_editor":9,"./sprite_list":10}],6:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _game = require('./game');

var game = _interopRequireWildcard(_game);

window.Game = game;

var FPS = 60;

var AnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

$(document).ready(function () {
  Game.init();

  if (AnimationFrame) {
    (function () {
      var updateLoop = function updateLoop() {
        Game.update();
        AnimationFrame(updateLoop);
      };
      var drawLoop = function drawLoop() {
        Game.draw();
        AnimationFrame(drawLoop);
      };

      updateLoop();
      drawLoop();
    })();
  } else {
    console.log("Falling back to setInterval, update your browser!");
    setInterval(Game.update, 1000 / FPS);
    setInterval(Game.draw, 1000 / FPS);
  }
});

},{"./game":5}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _ui = require('./ui');

var buttons = [];
var canvas = undefined;
var ctx = undefined;

var draw = function draw() {
  for (var _iterator = buttons, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var button = _ref;

    buttons.draw();
  }
};

var init = function init() {
  canvas = Game.canvas;
  ctx = Game.ctx;

  var buttonY = function buttonY(nthButton) {
    return canvas.height / 2 + nthButton * 40;
  };
  var buttonsWidth = canvas.width / 5;
  var buttonColumnX = 20;
  var buttonsHeight = 30;
  var buttonColumnY = canvas.height / 2;

  var loadMapEditor = function loadMapEditor() {
    Game.sprites.clear();
    Game.setState('load_map_editor');
  };

  var loadSettings = function loadSettings() {
    console.log("Stubbing settings load action");
  };

  exports.buttons = buttons = [new _ui.UI.Button(buttonColumnX, buttonY(0), buttonsWidth, buttonsHeight, "Map Editor", loadMapEditor), new _ui.UI.Button(buttonColumnX, buttonY(1), buttonsWidth, buttonsHeight, "Settings", loadSettings)];
  Game.sprites.push(buttons);
};

exports.buttons = buttons;
exports.init = init;
exports.draw = draw;

},{"./ui":11}],8:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function Map() {
  _classCallCheck(this, Map);
};

exports.Map = Map;

},{}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _entity = require('./entity');

var _map = require('./map');

var canvas = undefined;
var ctx = undefined;
var grid = undefined;
var map = new _map.Map();

var Grid = (function (_Entity) {
  _inherits(Grid, _Entity);

  function Grid() {
    var size = arguments.length <= 0 || arguments[0] === undefined ? 32 : arguments[0];

    _classCallCheck(this, Grid);

    _Entity.call(this, 0, 0);
    this.size = size;
    this.color = "#cccccc";
  }

  Grid.prototype.draw = function draw() {
    ctx.beginPath();
    for (var x = 0; x <= canvas.width; x += this.size) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }

    for (var y = 0; y <= canvas.height; y += this.size) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }

    ctx.strokeStyle = this.color;
    ctx.stroke();
  };

  return Grid;
})(_entity.Entity);

var init = function init() {
  ctx = Game.ctx;
  canvas = Game.canvas;
  grid = new Grid();
  Game.sprites.push(grid);
};

exports.init = init;

},{"./entity":3,"./map":8}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SpriteList = (function () {
  function SpriteList() {
    _classCallCheck(this, SpriteList);

    this.list = {};
  }

  SpriteList.prototype.push = function push(sprite) {
    if (sprite instanceof Array) {
      for (var _iterator = sprite, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _sprite = _ref;

        this.push(_sprite);
      }
    } else {
      this.list[sprite.id] = sprite;
    }
  };

  SpriteList.prototype.draw = function draw() {
    for (var _iterator2 = Object.keys(this.list), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var key = _ref2;

      this.list[key].draw();
    }
  };

  SpriteList.prototype.update = function update() {
    for (var _iterator3 = Object.keys(this.list), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var key = _ref3;

      if (this.list[key] == undefined) {
        console.log('sprites deleted in middle of update');
        continue;
      }
      if (this.list[key].update != undefined) this.list[key].update();
    }
  };

  SpriteList.prototype.clear = function clear() {
    this.list = {};
  };

  return SpriteList;
})();

exports.SpriteList = SpriteList;

},{}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _entity = require('./entity');

var _collision = require('./collision');

var Collision = _interopRequireWildcard(_collision);

var Button = (function (_Entity) {
  _inherits(Button, _Entity);

  function Button(x, y, width, height, text, clickAction) {
    _classCallCheck(this, Button);

    _Entity.call(this, x, y);
    this.width = width;
    this.height = height;
    this.text = text;
    this.clickAction = clickAction;
    this.clicked = false;
    this.hovered = false;
    this.background_color = "#cc6600";
    this.text_color = "#ffffff";
  }

  Button.prototype.draw = function draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.background_color;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    var fontSize = 24;
    this.ctx.fillStyle = this.text_color;
    this.ctx.font = fontSize + "px amatic-bold";
    this.ctx.textBaseline = "top";

    var textMargin = 3;
    var textSize = this.ctx.measureText(this.text);
    var textX = this.pos.x + this.width / 2 - textSize.width / 2;
    var textY = this.pos.y + this.height / 2 - fontSize / 2 - textMargin;

    this.ctx.fillText(this.text, textX, textY);
  };

  Button.prototype.update = function update() {
    if (Collision.intersects(this, Game.events.mouse)) {
      this.hovered = true;
      if (Game.events.mouse.clicked) {
        this.clicked = true;
        Game.events.mouse.clicked = false;
      } else if (this.clicked && !Game.events.mouse.down) {
        this.clicked = false;
        this.clickAction();
      }
    }
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

},{"./collision":2,"./entity":3}]},{},[6]);
