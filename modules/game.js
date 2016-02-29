import { SpriteList } from './sprite_list'
import * as Events from './events'
import * as assetManager from './asset_manager'
import * as mainMenu from './main_menu'

const States = ['loading', 'ready', 'paused', 'menu']

var canvas = undefined
var ctx = undefined
var events = Events
var state = 'begin'
var sprites = new SpriteList()
var activeSprites = new SpriteList()
var environmentSprites = new SpriteList()

var update = () => {
  switch (state) {
    case 'begin':
      state = 'idle'
      assetManager.loadAssets(() => {
        state = "load_main_menu";
        console.log("Loaded assets");
        sprites.clear()
      })
      break
    case 'load_main_menu':
      state = 'main_menu'
      mainMenu.init()
      //debugger
      break
    case 'main_menu':
      sprites.update()
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
  events.init(canvas)
}

export { state, sprites, canvas, ctx, events, update, draw, init }
