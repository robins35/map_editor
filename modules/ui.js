import { Entity } from './entity'

class Button extends Entity {

  constructor(x, y, width, height, text) {
    super(x, y)
    this.width = width
    this.height = height
    this.text = text
    this.clicked = false
    this.hovered = false
    this.background_color = "#cc6600"
    this.text_color = "#ffffff"
  }

  draw () {
    this.ctx.beginPath()
    this.ctx.fillStyle = this.background_color
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)

    var fontSize = 20
    this.ctx.fillStyle = this.text_color
    this.ctx.font = fontSize + "px amatic-bold"
    this.ctx.textBaseline = "top"

    var textMargin = 3
    var textSize = this.ctx.measureText(this.text)
    var textX = this.pos.x + (this.width / 2) - (textSize.width / 2)
    var textY = this.pos.y + (this.height / 2) - (fontSize / 2) - textMargin

    this.ctx.fillText(this.text, textX, textY)
  }
}

class ProgressBar extends Entity {
  constructor (total) {
    super(200, 200)
    this.total = total
    this.progress = 0
    this.width = 300
    this.height = 20
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

var UI = { Button, ProgressBar }

export { UI }
