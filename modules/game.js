import * as assetManager from './asset_manager'
import * as mainMenu from './main_menu'

const States = ['loading', 'ready', 'paused', 'menu']


class SpriteList {
  constructor() {
    this.list = {}
  }

  push(sprite) {
    this.list[sprite.id] = sprite
  }

  draw() {
    // Change to a better kind of iterator
    for (let i = 1; i <= Object.keys(this.list).length; i++) {
      this.list[i].draw()
    }
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
      state = 'loading'
      assetManager.loadAssets(() => { state = "main_menu"; console.log("Loaded assets"); })
      break
    case 'main_menu':
      //debugger
      break
    default:
      //console.log("No state matches in update loop")
  }
}

var draw = () => {
  sprites.draw()
}

var init = () => {
  canvas = document.getElementById("map_editor")
  ctx = canvas.getContext("2d")
}

export { state, sprites, canvas, ctx, update, draw, init }
