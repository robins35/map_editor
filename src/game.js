import { Entity, EntityList } from 'entity'
import * as AssetManager from 'asset_manager'
import * as MainMenu from 'main_menu'
import * as MapEditor from 'map_editor'

// There seems to be a bug in webpack's resolve property. The ./src dir should
// take precedence over node_modules, however it's loading the npm Events
// module instead of our custom one, so we must use a relative path.
import Events from './events'

const States = ['loading', 'ready', 'paused', 'menu']


let canvas = undefined
let ctx = undefined
let events = Events
let state = 'begin'
let previousState
let sprites = new EntityList()
let uiElements = new EntityList()
let environmentElements = new EntityList()


let update = () => {
  switch (state) {
    case 'begin':
      state = 'idle'
      AssetManager.loadAssets(() => {
        state = "load_main_menu";
        console.log("Loaded assets");
        uiElements.clear()
      })
      break
    case 'load_main_menu':
      state = 'main_menu'
      MainMenu.init()
      break
    case 'main_menu':
      uiElements.update()
      break
    case 'load_map_editor':
      state = 'map_editor'
      MapEditor.init()
      break
    case 'map_editor':
      // MapEditor.update()
      sprites.update()
      uiElements.update()
      environmentElements.update()
      break
    case 'pause':
      uiElements.update()
      break
    default:
      //console.log("No state matches in update loop")
  }
}

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  sprites.draw()
  environmentElements.draw()
  uiElements.draw()
}

let setState = (_state) => {
  previousState = state
  state = _state
}

let init = () => {
  canvas = document.getElementById("map_editor")
  canvas.pos = { x: 0, y: 0 }
  ctx = canvas.getContext("2d")
  events.init(canvas)
}

export {
  AssetManager,
  setState,
  state,
  sprites,
  uiElements,
  environmentElements,
  canvas,
  ctx,
  events,
  update,
  draw,
  init
}
