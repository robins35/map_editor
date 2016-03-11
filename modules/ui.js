import { Entity } from './entity'
import * as Collision from './collision'

class Button extends Entity {

  constructor(x, y, width, height, text, clickAction) {
    super(x, y, width, height)
    this.text = text
    this.clickAction = clickAction
    this.clicked = false
    this.backgroundColor = "#cc6600"
    this.hoveredBackgroundColor = "#da8e42"
    this.clickedBackgroundColor = "#bb4a00"
    this.textColor = "#ffffff"
    Button.hoveredButtons = {}
    Button.clickedButtons = {}
  }

  draw () {
    this.ctx.beginPath()
    if(Button.hoveredButtons[this.id]) {
      if(Button.clickedButtons[this.id])
        this.ctx.fillStyle = this.clickedBackgroundColor
      else
        this.ctx.fillStyle = this.hoveredBackgroundColor
      $(this.canvas).css({'cursor' : 'pointer'})
    }
    else {
      this.ctx.fillStyle = this.backgroundColor
      if(Object.keys(Button.hoveredButtons).length <= 0)
        $(this.canvas).css({'cursor' : 'default'})
    }
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)

    let fontSize = 24
    this.ctx.fillStyle = this.textColor
    this.ctx.font = fontSize + "px amatic-bold"
    this.ctx.textBaseline = "top"

    let textMargin = 3
    let textSize = this.ctx.measureText(this.text)
    let textX = this.pos.x + (this.width / 2) - (textSize.width / 2)
    let textY = this.pos.y + (this.height / 2) - (fontSize / 2) - textMargin

    this.ctx.fillText(this.text, textX, textY)
  }

  update() {
    if (Collision.intersects(this, Game.events.mouse)) {
      Button.hoveredButtons[this.id] = true
      if (Game.events.mouse.clicked) {
        Button.clickedButtons[this.id] = true
        Game.events.mouse.clicked = false
      }
      else if (Button.clickedButtons[this.id] && !Game.events.mouse.down) {
        delete Button.clickedButtons[this.id]
        this.clickAction()
      }
    }
    else if (Button.hoveredButtons[this.id]) {
      delete Button.hoveredButtons[this.id]
    }
  }
}

class ProgressBar extends Entity {
  constructor (total) {
    super(200, 200, 300, 20)
    this.total = total
    this.progress = 0
    this.color = "#ffffff"
  }

  draw () {
    this.ctx.beginPath()
    this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height)
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = this.color
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.pos.x, this.pos.y, this.calculateWidth(), this.height)
  }

  calculateWidth() {
    return this.width * (this.progress / this.total)
  }
}

let UI = { Button, ProgressBar }

export { UI }
