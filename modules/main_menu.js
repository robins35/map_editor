import { UI } from './ui'

let buttons = []
let canvas = undefined
let ctx = undefined

let draw = () => {
  for (let button of buttons) {
    buttons.draw()
  }
}

let init = () => {
  canvas = Game.canvas
  ctx = Game.ctx

  let buttonY = (nthButton) => ((canvas.height / 2) + (nthButton * (40)))
  let buttonsWidth = canvas.width / 5
  let buttonColumnX = 20
  let buttonsHeight = 30
  let buttonColumnY = (canvas.height / 2)

  let loadMapEditor = () => {
    Game.uiElements.clear()
    Game.setState('load_map_editor')
  }

  let loadSettings = () => {
    console.log("Stubbing settings load action")
  }

  buttons = [
    new UI.Button(buttonColumnX, buttonY(0), buttonsWidth, buttonsHeight, "Map Editor", loadMapEditor),
    new UI.Button(buttonColumnX, buttonY(1), buttonsWidth, buttonsHeight, "Settings", loadSettings)
  ]
  Game.uiElements.push(buttons)
}


export { buttons, init, draw }
