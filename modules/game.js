import { SpriteList } from './sprite_list'
import * as Events from './events'
import * as AssetManager from './asset_manager'
import * as MainMenu from './main_menu'
import * as MapEditor from './map_editor'

const States = ['loading', 'ready', 'paused', 'menu']

let canvas = undefined
let ctx = undefined
let events = Events
let state = 'begin'
let sprites = new SpriteList()
let activeSprites = new SpriteList()
let environmentSprites = new SpriteList()

let update = () => {
  switch (state) {
    case 'begin':
      state = 'idle'
      AssetManager.loadAssets(() => {
        state = "load_main_menu";
        console.log("Loaded assets");
        sprites.clear()
      })
      break
    case 'load_main_menu':
      state = 'main_menu'
      MainMenu.init()
      break
    case 'main_menu':
      sprites.update()
      break
    case 'load_map_editor':
      state = 'map_editor'
      MapEditor.init()
      break
    case 'map_editor':
      sprites.update()
      break
    default:
      //console.log("No state matches in update loop")
  }
}

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  sprites.draw()
}

let setState = (_state) => {
  state = _state
}

let init = () => {
  canvas = document.getElementById("map_editor")
  ctx = canvas.getContext("2d")
  events.init(canvas)
}

export { setState, sprites, canvas, ctx, events, update, draw, init }
