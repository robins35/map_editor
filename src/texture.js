import {Entity} from './entity'

export default class Texture extends Entity {
  constructor(x, y, key, img) {
    super(x, y, img.width, img.height)
    this.name = "Texture"
    this.key = key
    this.img = img
  }
}
