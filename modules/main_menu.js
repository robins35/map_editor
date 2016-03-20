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

  let loadMapEditor = () => {
    Game.uiElements.clear()
    Game.setState('load_map_editor')
  }

  let loadSettings = () => {
    console.log("Stubbing settings load action")
  }

  let buttonGrid = new UI.Grid({
    width: "20%",
    height: "50%",
    rowHeight: 30,
    margin: 30,
    rowMargin: 10,
    verticalAlignment: "bottom",
    rows: [
      [
        [UI.Button, {text: "Map Editor", clickAction: loadMapEditor}]
      ],
      [
        [UI.Button, {text: "Settings", clickAction: loadSettings}]
      ]
    ]
  })

  Game.sprites.clear()
  Game.environmentElements.clear()
  Game.uiElements.clear()

  Game.uiElements.push(buttonGrid)
}


export { buttons, init, draw }
