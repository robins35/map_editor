import {Entity} from './entity'
import * as Collision from './collision'

export class MiniMap extends Entity {
  constructor(map, container, viewPort) {
    let width = container.width
    let height = (map.height / map.width) * width
    super(0, 0, container.width, height)
    this.scale = width / map.width
    this.map = map
    this.container = container
    this.viewPort = viewPort
    this.miniViewPort = this.initMiniViewPort()
    this.backgroundColor = "#222222"
    this.canvas = Game.canvas
    this.ctx = Game.ctx
  }

  initMiniViewPort() {
    let viewPortDimensions = {
      width: this.viewPort.width,
      height: this.viewPort.height
    }
    let dimensions = Collision.vectorProduct(this.scale, viewPortDimensions)
    let position = Collision.vectorProduct(this.scale, this.viewPort.pos)

    return {
      width: dimensions.width,
      height: dimensions.height,
      pos: position,
      color: "#ffffff"
    }
  }

  updateMiniViewPort() {
    let position = Collision.vectorProduct(this.scale, this.viewPort.pos)
    this.miniViewPort.pos = position
  }

  draw() {
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)

    console.log(`Drawing rect at x: ${this.miniViewPort.pos.x}, y: ${this.miniViewPort.pos.y}. Width: ${this.miniViewPort.width}, Height: ${this.miniViewPort.height}`)
    this.ctx.strokeStyle = this.miniViewPort.color
    this.ctx.lineWidth = 3
    this.ctx.strokeRect(this.miniViewPort.pos.x, this.miniViewPort.pos.y,
        this.miniViewPort.width, this.miniViewPort.height)
  }

  update() {
    this.updateMiniViewPort()
  }
}
