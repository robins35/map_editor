import Entity from './entity'

class ProgressBar extends Entity {
  constructor (ctx, x, y, total) {
    super(ctx, x, y)
    this.total = total
    this.progress = 0
    this.width = 300
    this.height = 40
    this.color = "#FFF"
  }

  draw () {
    ctx.beginPath()
    ctx.rect(this.pos.x, this.pos.y, this.width, this.height)
    ctx.lineWidth = 2
    ctx.strokeStle = this.color
    ctx.stroke()

    // ctx.fillStyle = this.color
    // ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
  }
}

export default class ProgressBar
