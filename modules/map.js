import {Entity} from './entity'
import * as Collision from './collision'

export class Map {
  constructor(width, height, textureSize) {
    this.width = Math.trunc(width / textureSize) * textureSize
    this.height = Math.trunc(height / textureSize) * textureSize
    this.textureSize = textureSize
    this.columns = this.width / textureSize
    this.rows = this.height / textureSize
    this.viewPort = null

    this.map = []
    this.layout = []

    for(let column = 0; column < this.columns; column++) {
      this.map[column] = []
      this.layout[column] = []
    }
  }

  addTile(_texture) {
    if(this.viewPort) {
      var x = this.viewPort.pos.x + _texture.pos.x
      var y = this.viewPort.pos.y + _texture.pos.y
    }
    else {
      var x = _texture.pos.x
      var y = _texture.pos.y
    }

    let column = Math.trunc(x / _texture.width)
    let row = Math.trunc(y / _texture.height)

    let texture = new Texture(x, y, _texture.key, _texture.img)

    this.map[column][row] = texture
    this.layout[column][row] = texture.key
  }

  draw() {
    if(this.viewPort) {
      var startColumn = Math.trunc(this.viewPort.pos.x / this.textureSize)
      var endColumn = startColumn + Math.ceil(this.viewPort.width / this.textureSize)
      var startRow = Math.trunc(this.viewPort.pos.y / this.textureSize)
      var endRow = startRow + Math.ceil(this.viewPort.height / this.textureSize)

    }
    else {
      var startColumn = 0
      var endColumn = startColumn + Math.ceil(Game.canvas.width / this.textureSize)
      var startRow = 0
      var endRow = startRow + Math.ceil(Game.canvas.height / this.textureSize)
    }

    for(let column = startColumn; column <= endColumn; column++) {
      for(let row = startRow; row <= endRow; row++) {
        let texture = this.map[column][row]

        if(texture === undefined)
          continue

        let x = Collision.vectorDifference(this.viewPort.pos.x, (column * this.textureSize))
        let y = Collision.vectorDifference(this.viewPort.pos.y, (row * this.textureSize))

        Game.ctx.drawImage(texture.img, x, y, texture.width, texture.height)
      }
    }
  }
}

export class Texture extends Entity {
  constructor(x, y, key, img) {
    super(x, y, img.width, img.height)
    this.key = key
    this.img = img
  }
}
