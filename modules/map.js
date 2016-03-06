import {Entity} from './entity'
import * as Collision from './collision'

export class Map {
  constructor(width, height, textureSize) {
    this.id = "map"
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
      var endColumn = startColumn + Math.trunc(this.viewPort.width / this.textureSize)
      var startRow = Math.trunc(this.viewPort.pos.y / this.textureSize)
      var endRow = startRow + Math.trunc(this.viewPort.height / this.textureSize)
    }
    else {
      var startColumn = 0
      var endColumn = startColumn + Math.trunc(Game.canvas.width / this.textureSize)
      var startRow = 0
      var endRow = startRow + Math.trunc(Game.canvas.height / this.textureSize)
    }

    for(let column = startColumn; column <= endColumn; column++) {
      for(let row = startRow; row <= endRow; row++) {
        let texture = this.map[column][row]

        if(texture === undefined)
          continue

        let absolutePosition = { x: (column * this.textureSize), y: (row * this.textureSize) }
        let pos = Collision.vectorDifference(absolutePosition, this.viewPort.pos)

        Game.ctx.drawImage(texture.img, pos.x, pos.y, texture.width, texture.height)
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
