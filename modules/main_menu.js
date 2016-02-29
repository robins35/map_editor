import { UI } from './ui'

var buttons = []
var canvas = undefined
var ctx = undefined

var draw = () => {
  for (let button of buttons) {
    buttons.draw()
  }
}


var init = () => {
  canvas = Game.canvas
  ctx = Game.ctx

  let buttonY = (nthButton) => ((canvas.height / 2) + (nthButton * (40)))
  let buttonsWidth = canvas.width / 5
  let buttonColumnX = 20
  let buttonsHeight = 30
  let buttonColumnY = (canvas.height / 2)

  buttons = [
    new UI.Button(buttonColumnX, buttonY(0), buttonsWidth, buttonsHeight, "Map Editor"),
    new UI.Button(buttonColumnX, buttonY(1), buttonsWidth, buttonsHeight, "Settings")
  ]
  Game.sprites.push(buttons)
}


export { buttons, init, draw }
