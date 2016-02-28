import { Entity } from './entity'

class Button extends Entity {

  constructor(x, y, width, height, text) {
    super(x, y)
    this.width = width
    this.height = height
    this.text = text
    this.clicked = false
    this.hovered = false
    this.color = "#cccccc"
  }

  draw () {
    this.ctx.beginPath()
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)

    var fontSize = 20
    this.ctx.setFillColor(1, 1, 1, 1.0)
    this.ctx.font = fontSize + "px sans-serif"

    var textSize = this.ctx.measureText(this.text)
    var textX = this.x + (this.width / 2) - (textSize.width / 2)
    var textY = this.y + (this.height / 2) - (fontSize / 2)

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
