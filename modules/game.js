import * as assetManager from './asset_manager'
import * as mainMenu from './main_menu'

const States = ['loading', 'ready', 'paused', 'menu']


class SpriteList {
  constructor() {
    this.list = {}
  }

  push(sprite) {
    if(sprite instanceof Array) {
      for(let _sprite of sprite) {
        this.push(_sprite)
      }
    }
    else {
      this.list[sprite.id] = sprite
    }
  }

  draw() {
    for(let key of Object.keys(this.list)) {
      this.list[key].draw()
    }
  }

  clear() {
    this.list = {}
  }
}

var canvas = undefined
var ctx = undefined
var state = 'begin'
var sprites = new SpriteList()
var activeSprites = new SpriteList()
var environmentSprites = new SpriteList()

var update = () => {
  switch (state) {
    case 'begin':
      state = 'idle'
      assetManager.loadAssets(() => {
        state = "main_menu";
        console.log("Loaded assets");
        sprites.clear()
      })
      break
    case 'main_menu':
      state = 'idle'
       mainMenu.init()
      //debugger
      break
    default:
      //console.log("No state matches in update loop")
  }
}

var draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  sprites.draw()
}

var init = () => {
  canvas = document.getElementById("map_editor")
  ctx = canvas.getContext("2d")
}

export { state, sprites, canvas, ctx, update, draw, init }
