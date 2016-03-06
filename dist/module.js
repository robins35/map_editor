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
            var imagePath = src.split('/').slice(-2);
            image_type = imagePath[0];
            image_name = imagePath[1].split('.').slice(0, -1).join('.');

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

var pointsAreEqual = function pointsAreEqual(point1, point2) {
  return point1.x == point2.x && point1.y == point2.y;
};

exports.intersects = intersects;
exports.vectorSum = vectorSum;
exports.vectorDifference = vectorDifference;
exports.pointsAreEqual = pointsAreEqual;

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
    mouse.dragStart = null;
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
      exports.state = state = 'idle';
      AssetManager.loadAssets(function () {
        exports.state = state = "load_main_menu";
        console.log("Loaded assets");
        uiElements.clear();
      });
      break;
    case 'load_main_menu':
      exports.state = state = 'main_menu';
      MainMenu.init();
      break;
    case 'main_menu':
      uiElements.update();
      break;
    case 'load_map_editor':
      exports.state = state = 'map_editor';
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
  environmentElements.draw();
  uiElements.draw();
};

var setState = function setState(_state) {
  exports.state = state = _state;
};

var init = function init() {
  exports.canvas = canvas = document.getElementById("map_editor");
  exports.ctx = ctx = canvas.getContext("2d");
  events.init(canvas);
};

exports.AssetManager = AssetManager;
exports.setState = setState;
exports.state = state;
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
'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _entity = require('./entity');

var _collision = require('./collision');

var Collision = _interopRequireWildcard(_collision);

var Map = (function () {
  function Map(width, height, textureSize) {
    _classCallCheck(this, Map);

    this.id = "map";
    this.width = Math.trunc(width / textureSize) * textureSize;
    this.height = Math.trunc(height / textureSize) * textureSize;
    this.textureSize = textureSize;
    this.columns = this.width / textureSize;
    this.rows = this.height / textureSize;
    this.viewPort = null;

    this.map = [];
    this.layout = [];

    for (var column = 0; column < this.columns; column++) {
      this.map[column] = [];
      this.layout[column] = [];
    }
  }

  Map.prototype.addTile = function addTile(_texture) {
    if (this.viewPort) {
      var x = this.viewPort.pos.x + _texture.pos.x;
      var y = this.viewPort.pos.y + _texture.pos.y;
    } else {
      var x = _texture.pos.x;
      var y = _texture.pos.y;
    }

    var column = Math.trunc(x / _texture.width);
    var row = Math.trunc(y / _texture.height);

    var texture = new Texture(x, y, _texture.key, _texture.img);

    this.map[column][row] = texture;
    this.layout[column][row] = texture.key;
  };

  Map.prototype.draw = function draw() {
    if (this.viewPort) {
      var startColumn = Math.trunc(this.viewPort.pos.x / this.textureSize);
      var endColumn = startColumn + Math.trunc(this.viewPort.width / this.textureSize);
      var startRow = Math.trunc(this.viewPort.pos.y / this.textureSize);
      var endRow = startRow + Math.trunc(this.viewPort.height / this.textureSize);
    } else {
      var startColumn = 0;
      var endColumn = startColumn + Math.trunc(Game.canvas.width / this.textureSize);
      var startRow = 0;
      var endRow = startRow + Math.trunc(Game.canvas.height / this.textureSize);
    }

    for (var column = startColumn; column <= endColumn; column++) {
      for (var row = startRow; row <= endRow; row++) {
        var texture = this.map[column][row];

        if (texture === undefined) continue;

        var absolutePosition = { x: column * this.textureSize, y: row * this.textureSize };
        var pos = Collision.vectorDifference(absolutePosition, this.viewPort.pos);

        Game.ctx.drawImage(texture.img, pos.x, pos.y, texture.width, texture.height);
      }
    }
  };

  return Map;
})();

exports.Map = Map;

var Texture = (function (_Entity) {
  _inherits(Texture, _Entity);

  function Texture(x, y, key, img) {
    _classCallCheck(this, Texture);

    _Entity.call(this, x, y, img.width, img.height);
    this.key = key;
    this.img = img;
  }

  return Texture;
})(_entity.Entity);

exports.Texture = Texture;

},{"./collision":2,"./entity":3}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _entity = require('./entity');

var _map2 = require('./map');

var _view_port = require('./view_port');

var _collision = require('./collision');

var Collision = _interopRequireWildcard(_collision);

var textureSize = 32;

var canvas = undefined;
var ctx = undefined;
var grid = undefined;
var viewPort = undefined;
var textureMenu = undefined;
var map = undefined;

var TextureMenu = (function (_Entity) {
  _inherits(TextureMenu, _Entity);

  function TextureMenu(viewPort) {
    _classCallCheck(this, TextureMenu);

    var height = Game.canvas.height - viewPort.height;
    var y = viewPort.height;
    _Entity.call(this, 0, y, Game.canvas.width, height);
    this.backgroundColor = '#2a1d16';
    this.textures = Game.AssetManager.imgs["textures"];
    this.selectedTexture = null;
    this.textureWidth = this.textures[Object.keys(this.textures)[0]].width;
    this.setupMenuProperties();
    this.texturesPerPage = this.textureColumnCount * this.textureRowCount;

    this.initTextureObjects();
    this.totalPages = this.textureObjects.length;
    this.page = 0;
    this.setupIcons();
  }

  TextureMenu.prototype.setupMenuProperties = function setupMenuProperties() {
    this.imagePadding = 5;
    var minimumTextureRowWidth = this.width - 80;
    this.textureColumnCount = Math.trunc(minimumTextureRowWidth / (this.textureWidth + this.imagePadding));
    var textureRowWidth = this.textureColumnCount * (this.textureWidth + this.imagePadding) - this.imagePadding;

    var minimumTextureRowHeight = this.height - this.imagePadding * 2;
    this.textureRowCount = Math.trunc(minimumTextureRowHeight / (this.textureWidth + this.imagePadding));
    var textureRowHeight = this.textureRowCount * (this.textureWidth + this.imagePadding) - this.imagePadding;

    this.leftRightPadding = (this.width - textureRowWidth) / 2;
    this.topBottomPadding = (this.height - textureRowHeight) / 2;
  };

  TextureMenu.prototype.setupIcons = function setupIcons() {
    var allIcons = Game.AssetManager.imgs["icons"];
    this.icons = {};

    var icon = allIcons["left_arrow"];
    icon.pos = { x: this.imagePadding, y: this.pos.y + this.height / 2 - icon.height / 2 };
    icon.clickAction = this.previousPage.bind(this);
    if (this.page <= 0) icon.hidden = true;
    this.icons["left_arrow"] = icon;

    icon = allIcons["right_arrow"];
    icon.pos = { x: this.width - icon.width - this.imagePadding, y: this.pos.y + this.height / 2 - icon.height / 2 };
    icon.clickAction = this.nextPage.bind(this);
    if (this.page >= this.totalPages - 1) icon.hidden = true;
    this.icons["right_arrow"] = icon;
  };

  TextureMenu.prototype.initTextureObjects = function initTextureObjects() {
    var x = this.pos.x + this.leftRightPadding;
    var y = this.pos.y + this.topBottomPadding;
    var currentRow = 0;
    var currentColumn = 0;

    var textureKeys = Object.keys(this.textures);
    var page = 0;
    this.textureObjects = [[]];

    for (var _iterator = textureKeys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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

      var texture = new _map2.Texture(x, y, key, this.textures[key]);
      this.textureObjects[page].push(texture);
      currentColumn++;

      x += texture.width + this.imagePadding;
      if (currentColumn >= this.textureColumnCount) {
        x = this.pos.x + this.leftRightPadding;
        y += texture.height + this.imagePadding;
        currentColumn = 0;
        currentRow++;
        if (currentRow >= this.textureRowCount) {
          y = this.pos.y + this.topBottomPadding;
          currentRow = 0;
          page++;
          this.textureObjects[page] = [];
        }
      }
    }
  };

  TextureMenu.prototype.updateArrowIcons = function updateArrowIcons() {
    if (this.page == this.totalPages - 1) this.icons["right_arrow"].hidden = true;else this.icons["right_arrow"].hidden = false;

    if (this.page == 0) this.icons["left_arrow"].hidden = true;else this.icons["left_arrow"].hidden = false;
  };

  TextureMenu.prototype.nextPage = function nextPage() {
    if (this.page >= this.totalPages - 1) return;
    this.page++;
    this.updateArrowIcons();
  };

  TextureMenu.prototype.previousPage = function previousPage() {
    if (this.page <= 0) return;
    this.page--;
    this.updateArrowIcons();
  };

  TextureMenu.prototype.draw = function draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    for (var _iterator2 = this.textureObjects[this.page], _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var texture = _ref2;

      this.ctx.drawImage(texture.img, texture.pos.x, texture.pos.y, texture.width, texture.height);
      if (this.selectedTexture && this.selectedTexture.id == texture.id) {
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "#00ff00";
        this.ctx.strokeRect(texture.pos.x, texture.pos.y, texture.width, texture.height);
      }
      if (texture.hovering && (!this.selectedTexture || this.selectedTexture && this.selectedTexture.id != texture.id)) {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#90c3d4";
        this.ctx.strokeRect(texture.pos.x, texture.pos.y, texture.width, texture.height);
      }
    }

    for (var _iterator3 = Object.keys(this.icons), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var iconKey = _ref3;

      var icon = this.icons[iconKey];
      if (!icon.hidden) this.ctx.drawImage(icon, icon.pos.x, icon.pos.y, icon.width, icon.height);
    }
  };

  TextureMenu.prototype.update = function update() {
    if (Collision.intersects(this, Game.events.mouse)) {
      for (var _iterator4 = this.textureObjects[this.page], _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray4) {
          if (_i4 >= _iterator4.length) break;
          _ref4 = _iterator4[_i4++];
        } else {
          _i4 = _iterator4.next();
          if (_i4.done) break;
          _ref4 = _i4.value;
        }

        var texture = _ref4;

        if (Collision.intersects(texture, Game.events.mouse)) {
          texture.hovering = true;
          if (Game.events.mouse.clicked) {
            this.selectedTexture = texture;
          }
        } else {
          texture.hovering = false;
        }
      }

      if (Game.events.mouse.clicked) {
        Game.events.mouse.clicked = false;
        for (var _iterator5 = Object.keys(this.icons), _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
          var _ref5;

          if (_isArray5) {
            if (_i5 >= _iterator5.length) break;
            _ref5 = _iterator5[_i5++];
          } else {
            _i5 = _iterator5.next();
            if (_i5.done) break;
            _ref5 = _i5.value;
          }

          var iconKey = _ref5;

          var icon = this.icons[iconKey];
          if (!icon.hidden && Collision.intersects(icon, Game.events.mouse)) icon.clickAction();
        }
      }
    }
  };

  return TextureMenu;
})(_entity.Entity);

var Grid = (function (_Entity2) {
  _inherits(Grid, _Entity2);

  function Grid(_map, _viewPort, _textureMenu) {
    var size = arguments.length <= 3 || arguments[3] === undefined ? 32 : arguments[3];

    _classCallCheck(this, Grid);

    _Entity2.call(this, 0, 0, canvas.width - canvas.width % size, textureMenu.pos.y - textureMenu.pos.y % size);
    this.drawWidth = canvas.width;
    this.drawHeight = textureMenu.pos.y;
    this.size = size;
    this.color = "#cccccc";
    this.map = _map;
    this.viewPort = _viewPort;
    this.textureMenu = _textureMenu;
    this.texturePreview = null;
    this.lastTexturePlacedAt = null;
    this.texturePreviewAlpha = 0.3;
  }

  Grid.prototype.resetDimensions = function resetDimensions() {
    var xToRight = canvas.width - this.pos.x;
    this.width = xToRight - xToRight % this.size;
    var yToBottom = this.textureMenu.pos.y - this.pos.y;
    this.height = yToBottom - yToBottom % this.size;
  };

  Grid.prototype.draw = function draw() {
    ctx.beginPath();
    for (var x = this.pos.x + 0.5; x <= this.drawWidth; x += this.size) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.drawHeight);
    }

    for (var y = this.pos.y + 0.5; y <= this.drawHeight; y += this.size) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.drawWidth, y);
    }

    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (this.texturePreview && !this.viewPort.positionAtDragStart) {
      this.ctx.save();
      this.ctx.globalAlpha = this.texturePreviewAlpha;

      var texture = this.texturePreview;
      this.ctx.drawImage(texture.img, texture.pos.x, texture.pos.y, texture.width, texture.height);

      this.ctx.restore();
    }
  };

  Grid.prototype.update = function update() {
    var xOffset = this.viewPort.pos.x % this.size;
    var yOffset = this.viewPort.pos.y % this.size;

    var x = xOffset ? this.size - xOffset : 0;
    var y = yOffset ? this.size - yOffset : 0;
    this.move(x, y);
    this.resetDimensions();

    if (this.textureMenu.selectedTexture) {
      if (Collision.intersects(this, Game.events.mouse)) {
        var columnIntersected = Math.trunc((Game.events.mouse.x - this.pos.x) / this.size);
        var rowIntersected = Math.trunc((Game.events.mouse.y - this.pos.y) / this.size);

        var _x2 = this.pos.x + columnIntersected * this.size;
        var _y = this.pos.y + rowIntersected * this.size;
        if (this.texturePreview) {
          this.texturePreview.pos = { x: _x2, y: _y };
        } else {
          this.texturePreview = new _map2.Texture(_x2, _y, this.textureMenu.selectedTexture.key, this.textureMenu.selectedTexture.img);
        }

        if (Game.events.mouse.rightDown) {
          if (!this.lastTexturePlacedAt || !Collision.pointsAreEqual(this.texturePreview.pos, this.lastTexturePlacedAt)) {

            this.lastTexturePlacedAt = this.texturePreview.pos;
            this.map.addTile(this.texturePreview);
          }
        } else if (this.lastTexturePlacedAt && !Game.events.mouse.rightDown) {
          this.lastTexturePlacedAt = null;
        }
      } else {
        this.texturePreview = null;
      }
    }
  };

  return Grid;
})(_entity.Entity);

var update = function update() {
  viewPort.update();
};

var init = function init() {
  ctx = Game.ctx;
  canvas = Game.canvas;
  map = new _map2.Map(canvas.width * 2, canvas.height * 2, textureSize);

  var viewPortWidth = canvas.width;
  var viewPortHeight = canvas.height - canvas.height / 5;

  viewPort = new _view_port.ViewPort(viewPortWidth, viewPortHeight, map);
  textureMenu = new TextureMenu(viewPort);
  grid = new Grid(map, viewPort, textureMenu);
  Game.uiElements.push(textureMenu);
  Game.environmentElements.push([map, grid]);
};

exports.init = init;
exports.update = update;

},{"./collision":2,"./entity":3,"./map":8,"./view_port":11}],10:[function(require,module,exports){
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

  function ViewPort(width, height, map) {
    _classCallCheck(this, ViewPort);

    _Entity.call(this, 0, 0, width, height);
    this.speed = 2;
    this.positionAtDragStart = null;
    this.map = map;
    this.map.viewPort = this;
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

    if (Game.state == 'map_editor' && Game.events.mouse.dragging) {
      var dragStartPositionOnMap = Collision.vectorSum(this.pos, Game.events.mouse.dragStart);
      if (Collision.intersects(this, dragStartPositionOnMap)) {
        if (this.positionAtDragStart === null) {
          this.positionAtDragStart = Object.assign({}, this.pos);
          $(Game.canvas).css({ 'cursor': 'move' });
        }

        var start = Game.events.mouse.dragStart;
        var end = { x: Game.events.mouse.x, y: Game.events.mouse.y };
        var moveVector = Collision.vectorDifference(start, end);

        var movePosition = Collision.vectorSum(this.positionAtDragStart, moveVector);
        this.safeMove(movePosition.x, movePosition.y);
      }
    } else {
      this.positionAtDragStart = null;
    }
  };

  return ViewPort;
})(_entity.Entity);

exports.ViewPort = ViewPort;

},{"./collision":2,"./entity":3}]},{},[6]);
