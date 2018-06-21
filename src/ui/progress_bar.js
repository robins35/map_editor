import UIElement from './ui_element'

export default class ProgressBar extends UIElement {
  constructor (canvas, properties) {
    super(canvas, properties)
    this.name = "UI.ProgressBar"
    this.total = properties["total"]
    this.progress = 0
  }

  draw () {
    this.ctx.beginPath()
    this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height)
    this.ctx.lineWidth = this.borderWidth
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
