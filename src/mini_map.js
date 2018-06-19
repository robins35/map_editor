import {Entity} from './entity'
import * as Collision from './collision'

export class MiniMap extends Entity {
  constructor({map, parent, viewPort}) {
    let width = parent.width
    let height = (map.height / map.width) * width
    super(0, 0, parent.width, height)
    this.name = "MiniMap"
    this.scale = width / map.width
    this.inverseScale = 1 / this.scale
    this.map = map
    this.parent = parent
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
    if(Collision.intersects(this, Game.events.mouse)) {
      if(Game.events.mouse.down) {
        let x = (Game.events.mouse.x - (this.miniViewPort.width / 2)) * this.inverseScale
        let y = (Game.events.mouse.y - (this.miniViewPort.height / 2)) * this.inverseScale
        this.viewPort.safeMove(x, y)
      }
    }
    let position = Collision.vectorProduct(this.scale, this.viewPort.pos)
    this.miniViewPort.pos = position
  }

  scaledTextureDetails(texture) {
    return {
      pos: Collision.vectorProduct(this.scale, texture.pos),
      width: texture.width * this.scale,
      height: texture.height * this.scale
    }
  }

  draw() {
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)

    let startColumn = 0
    let startRow = 0
    let endColumn = Math.trunc(this.map.width % this.map.textureSize)
    let endRow = Math.trunc(this.map.height % this.map.textureSize)

    for(let column of this.map.map) {
      for(let texture of column) {
        if(texture === undefined)
          continue
        let textureDetails = this.scaledTextureDetails(texture)

        this.ctx.drawImage(texture.img, textureDetails.pos.x, textureDetails.pos.y, textureDetails.width, textureDetails.height)
      }
    }

    this.ctx.strokeStyle = this.miniViewPort.color
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(this.miniViewPort.pos.x, this.miniViewPort.pos.y,
        this.miniViewPort.width, this.miniViewPort.height)
  }

  update() {
    this.updateMiniViewPort()
  }
}
