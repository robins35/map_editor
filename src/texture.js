import {Entity} from 'entity'

export default class Texture extends Entity {
  constructor(x, y, key, img, width = img.width, sx = 0, sy = 0) {
    super(x, y, width, img.height)
    this.name = "Texture"
    this.key = key
    this.img = img
    this.sx = sx
    this.sy = sy
  }

  draw() {
    this.ctx.drawImage(this.img, this.sx, this.sy, this.width, this.height, this.pos.x, this.pos.y, this.width, this.height)
  }
}
