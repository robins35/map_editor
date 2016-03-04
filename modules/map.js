import {Entity} from './entity'

export class Map {
  constructor(width, height) {
    this.width = width
    this.height = height
  }
}

export class Texture extends Entity {
  constructor(x, y, img) {
    super(x, y, img.width, img.height)
    this.img = img
  }
}
