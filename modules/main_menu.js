import { UI } from './ui'

var buttons = []
var canvas = undefined
var ctx = undefined

var draw = () => {
  for (let i = 1; i < buttons.length; i++) {
    buttons[i].draw()
  }
}

var init = () => {
  canvas = window.game.canvas
  ctx = window.game.ctx
  var buttonsWidth = canvas.width / 4
  var buttonColumnX = (canvas.width / 2) - buttonsWidth
  var buttonsHeight
  var buttonColumnY = (canvas.height / 2)

  buttons = [
    new UI.Button(buttonColumnX, buttonColumnY, buttonsWidth, buttonsHeight, "Map Editor"),
    new UI.Button(buttonColumnX, buttonColumnY + (2 * buttonsHeight), buttonsWidth, buttonsHeight, "Settings")
  ]
}


export { buttons, init, draw }
