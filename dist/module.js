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
        url: '/load_images',
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
    Game.uiElements.push(progressBar);

    if (imgPaths.length == 0) downloadCallback();
    for (var i = 0; i < imgPaths.length; i++) {
        (function (src) {
            var image_type, image_name;

            var _src$split$slice = src.split('/').slice(-2);

            image_type = _src$split$slice[0];
            image_name = _src$split$slice[1];

            if (imgs[image_type] === undefined) imgs[image_type] = {};

            imgs[image_type][image_name] = new Image();

            imgs[image_type][image_name].addEventListener("load", function () {
                successCount++;
                progressBar.progress++;
                if (isDone()) downloadCallback();
            }, false);

            imgs[image_type][image_name].addEventListener("error", function () {
                errorCount++;
                console.log("Error loading image " + this.src);
                if (isDone()) downloadCallback();
            }, false);

            imgs[image_type][image_name].src = src;
        })(imgPaths[i]);
    }
};

// var loadAudio = function(downloadCallback) {
//     if(imgPaths.length == 0) downloadCallback();
// }

var loadAssets = function loadAssets(downloadCallback) {
    loadImagePaths(downloadCallback);
};

var getImage = function getImage(image_type, image_name) {
    return imgs[image_type][image_name];
};

exports.loadAssets = loadAssets;
exports.getImage = getImage;
exports.imgs = imgs;

// var getAudio = function(name) {
//     return snds[name];
// }

},{"./ui":10}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;
var intersects = function intersects(obj, point) {
  var tolerance = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var xIntersect = point.x + tolerance > obj.pos.x && point.x - tolerance < obj.pos.x + obj.width;
  var yIntersect = point.y + tolerance > obj.pos.y && point.y - tolerance < obj.pos.y + obj.height;
  return xIntersect && yIntersect;
};

var vectorSum = function vectorSum(vector1, vector2) {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y
  };
};

var vectorDifference = function vectorDifference(vector1, vector2) {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y
  };
};

exports.intersects = intersects;
exports.vectorSum = vectorSum;
exports.vectorDifference = vectorDifference;

},{}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = (function () {
  function Entity(x, y, width, height) {
    _classCallCheck(this, Entity);

    Entity.id = Entity.id === undefined ? 1 : Entity.id;
    this.id = Entity.id++;
    this.pos = { x: x, y: y };
    this.width = width;
    this.height = height;
    this.canvas = Game.canvas;
    this.ctx = Game.ctx;
  }

  Entity.prototype.maxX = function maxX() {
    return this.canvas.width - this.width;
  };

  Entity.prototype.maxY = function maxY() {
    return this.canvas.height - this.height;
  };

  Entity.prototype.move = function move(x, y) {
    this.pos = { x: x, y: y };
  };

  Entity.prototype.safeMove = function safeMove(x, y) {
    if (x > this.maxX()) this.pos.x = this.maxX();else if (x < 0) this.pos.x = 0;else this.pos.x = x;

    if (y > this.maxY()) this.pos.y = this.maxY();else if (y < 0) this.pos.y = 0;else this.pos.y = y;
  };

  return Entity;
})();

exports.Entity = Entity;

var EntityList = (function () {
  function EntityList() {
    _classCallCheck(this, EntityList);

    this.list = {};
  }

  EntityList.prototype.push = function push(entity) {
    if (entity instanceof Array) {
      for (var _iterator = entity, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _entity = _ref;

        this.push(_entity);
      }
    } else {
      this.list[entity.id] = entity;
    }
  };

  EntityList.prototype.draw = function draw() {
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

  EntityList.prototype.update = function update() {
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
        continue;
      }
      if (this.list[key].update != undefined) this.list[key].update();
    }
  };

  EntityList.prototype.clear = function clear() {
    this.list = {};
  };

  return EntityList;
})();

exports.EntityList = EntityList;

},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;
var mouse = {
  x: 0,
  y: 0,
  clicked: false,
  down: false,
  rightClicked: false,
  rightDown: false,
  dragging: false,
  dragStart: null
};

var keysDown = {};

var init = function init(canvas) {
  $(canvas).on('mousemove', function (e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    mouse.clicked = e.which == 1 && !mouse.down;
    mouse.down = e.which == 1;
    mouse.rightClicked = e.which == 3 && !mouse.rightDown;
    mouse.rightDown = e.which == 3;
    if (e.which == 1 && mouse.down && !mouse.clicked && mouse.dragging == false) {
      mouse.dragging = true;
      mouse.dragStart = { x: mouse.x, y: mouse.y };
    }
  });

  $(canvas).on('mousedown', function (e) {
    if (e.which == 1) {
      mouse.clicked = !mouse.down;
      mouse.down = true;
    } else if (e.which == 3) {
      mouse.rightClicked = !mouse.rightDown;
      mouse.rightDown = true;
    }
  });

  $(canvas).on('mouseup', function (e) {
    if (e.which == 1) {
      mouse.down = false;
      mouse.clicked = false;
      if (mouse.dragging) {
        mouse.dragging = false;
        mouse.dragStart = null;
        $(canvas).css({ 'cursor': 'default' });
      }
    } else if (e.which == 3) {
      mouse.rightDown = false;
      mouse.rightClicked = false;
    }
  });

  $(canvas).on('contextmenu', function (e) {
    return false;
  });

  $(canvas).on('mouseleave', function (e) {
    mouse.dragging = false;
    mouse.dragStar = null;
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

var _entity = require('./entity');

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
var sprites = new _entity.EntityList();
var uiElements = new _entity.EntityList();
var environmentElements = new _entity.EntityList();

var update = function update() {
  switch (state) {
    case 'begin':
      state = 'idle';
      AssetManager.loadAssets(function () {
        state = "load_main_menu";
        console.log("Loaded assets");
        uiElements.clear();
      });
      break;
    case 'load_main_menu':
      state = 'main_menu';
      MainMenu.init();
      break;
    case 'main_menu':
      uiElements.update();
      break;
    case 'load_map_editor':
      state = 'map_editor';
      MapEditor.init();
      break;
    case 'map_editor':
      MapEditor.update();
      sprites.update();
      uiElements.update();
      environmentElements.update();
      break;
    default:
    //console.log("No state matches in update loop")
  }
};

var draw = function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sprites.draw();
  uiElements.draw();
  environmentElements.draw();
};

var setState = function setState(_state) {
  state = _state;
};

var init = function init() {
  exports.canvas = canvas = document.getElementById("map_editor");
  exports.ctx = ctx = canvas.getContext("2d");
  events.init(canvas);
};

exports.AssetManager = AssetManager;
exports.setState = setState;
exports.sprites = sprites;
exports.uiElements = uiElements;
exports.environmentElements = environmentElements;
exports.canvas = canvas;
exports.ctx = ctx;
exports.events = events;
exports.update = update;
exports.draw = draw;
exports.init = init;

},{"./asset_manager":1,"./entity":3,"./events":4,"./main_menu":7,"./map_editor":9}],6:[function(require,module,exports){
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
    Game.uiElements.clear();
    Game.setState('load_map_editor');
  };

  var loadSettings = function loadSettings() {
    console.log("Stubbing settings load action");
  };

  exports.buttons = buttons = [new _ui.UI.Button(buttonColumnX, buttonY(0), buttonsWidth, buttonsHeight, "Map Editor", loadMapEditor), new _ui.UI.Button(buttonColumnX, buttonY(1), buttonsWidth, buttonsHeight, "Settings", loadSettings)];
  Game.uiElements.push(buttons);
};

exports.buttons = buttons;
exports.init = init;
exports.draw = draw;

},{"./ui":10}],8:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function Map(width, height) {
  _classCallCheck(this, Map);

  this.width = width;
  this.height = height;
};

exports.Map = Map;

},{}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _entity = require('./entity');

var _map = require('./map');

var _view_port = require('./view_port');

var canvas = undefined;
var ctx = undefined;
var grid = undefined;
var viewPort = undefined;
var textureMenu = undefined;
var map = undefined;

var TextureMenu = (function (_Entity) {
  _inherits(TextureMenu, _Entity);

  function TextureMenu() {
    _classCallCheck(this, TextureMenu);

    var height = Game.canvas.height / 5;
    var y = Game.canvas.height - height;
    _Entity.call(this, 0, y, Game.canvas.width, height);
    this.backgroundColor = '#381807';
    this.opacity = 0.4;
    this.leftRightPadding = 30;
    this.imagePadding = 5;
    this.textures = Game.AssetManager.imgs["textures"];
  }

  TextureMenu.prototype.draw = function draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    this.ctx.restore();

    var x = this.pos.x + this.leftRightPadding;
    var y = this.pos.y + this.imagePadding;

    for (var _iterator = Object.keys(this.textures), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var key = _ref;

      var texture = this.textures[key];
      this.ctx.drawImage(texture, x, y, texture.width, texture.height);
      x += texture.width + this.imagePadding;
      if (x + texture.width > this.width - this.leftRightPadding) {
        x = this.pos.x + this.leftRightPadding;
        y += texture.height + this.imagePadding;
        if (y + texture.height + this.imagePadding > this.pos.y + this.height) break;
      }
    }
  };

  return TextureMenu;
})(_entity.Entity);

var Grid = (function (_Entity2) {
  _inherits(Grid, _Entity2);

  function Grid(_viewPort, _textureMenu) {
    var size = arguments.length <= 2 || arguments[2] === undefined ? 32 : arguments[2];

    _classCallCheck(this, Grid);

    _Entity2.call(this, 0, 0, canvas.width, textureMenu.pos.y);
    this.size = size;
    this.color = "#cccccc";
    this.viewPort = _viewPort;
    this.textureMenu = _textureMenu;
  }

  Grid.prototype.draw = function draw() {
    ctx.beginPath();
    for (var x = this.pos.x + 0.5; x <= this.width; x += this.size) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }

    for (var y = this.pos.y + 0.5; y <= this.height; y += this.size) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  Grid.prototype.update = function update() {
    var x = this.size - this.viewPort.pos.x % this.size;
    var y = this.size - this.viewPort.pos.y % this.size;
    this.move(x, y);
  };

  return Grid;
})(_entity.Entity);

var update = function update() {
  viewPort.update();
  //grid.update()
};

var init = function init() {
  ctx = Game.ctx;
  canvas = Game.canvas;
  map = new _map.Map(canvas.width * 2, canvas.height * 2);
  viewPort = new _view_port.ViewPort(map);
  textureMenu = new TextureMenu();
  grid = new Grid(viewPort, textureMenu);
  Game.uiElements.push(textureMenu);
  Game.environmentElements.push(grid);
};

exports.init = init;
exports.update = update;

},{"./entity":3,"./map":8,"./view_port":11}],10:[function(require,module,exports){
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

    _Entity.call(this, x, y, width, height);
    this.text = text;
    this.clickAction = clickAction;
    this.clicked = false;
    this.hovered = false;
    this.backgroundColor = "#cc6600";
    this.textColor = "#ffffff";
  }

  Button.prototype.draw = function draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    var fontSize = 24;
    this.ctx.fillStyle = this.textColor;
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

    _Entity2.call(this, 200, 200, 300, 20);
    this.total = total;
    this.progress = 0;
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

},{"./collision":2,"./entity":3}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _entity = require('./entity');

var _collision = require('./collision');

var Collision = _interopRequireWildcard(_collision);

var ViewPort = (function (_Entity) {
  _inherits(ViewPort, _Entity);

  function ViewPort(map) {
    _classCallCheck(this, ViewPort);

    _Entity.call(this, 0, 0, Game.canvas.width, Game.canvas.height);
    this.map = map;
    this.speed = 2;
    this.positionAtDragStart = null;
  }

  ViewPort.prototype.maxX = function maxX() {
    return this.map.width - this.width;
  };

  ViewPort.prototype.maxY = function maxY() {
    return this.map.height - this.height;
  };

  ViewPort.prototype.update = function update() {
    if (Game.events.keysDown[37]) this.safeMove(this.pos.x - this.speed, this.pos.y);

    if (Game.events.keysDown[38]) this.safeMove(this.pos.x, this.pos.y - this.speed);

    if (Game.events.keysDown[39]) this.safeMove(this.pos.x + this.speed, this.pos.y);

    if (Game.events.keysDown[40]) this.safeMove(this.pos.x, this.pos.y + this.speed);

    if (Game.events.mouse.dragging) {
      if (this.positionAtDragStart === null) {
        this.positionAtDragStart = Object.assign({}, this.pos);
        $(Game.canvas).css({ 'cursor': 'move' });
      }

      var start = Game.events.mouse.dragStart;
      var end = { x: Game.events.mouse.x, y: Game.events.mouse.y };
      var moveVector = Collision.vectorDifference(start, end);

      var movePosition = Collision.vectorSum(this.positionAtDragStart, moveVector);
      this.safeMove(movePosition.x, movePosition.y);
    } else {
      this.positionAtDragStart = null;
    }
  };

  return ViewPort;
})(_entity.Entity);

exports.ViewPort = ViewPort;

},{"./collision":2,"./entity":3}]},{},[6]);
