import { Entity } from './entity'

export class ProgressBar extends Entity {
  constructor (ctx, total) {
    super(ctx, 200, 200)
    this.total = total
    this.progress = 0
    this.width = 300
    this.height = 40
    this.color = "white"
  }

  draw () {
    this.ctx.beginPath()
    this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height)
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = this.color
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.strokeStyle = this.color
    this.ctx.fillRect(this.pos.x, this.pos.y, this.calculateWidth(), this.height)
  }

  calculateWidth() {
    return this.width * (this.progress / this.total)
  }
}
