import {Entity} from './entity'
import * as Collision from './collision'

class Command {
  constructor(list, previous, next, command, params) {
    Command.id = (Command.id === undefined) ? 1 : Command.id
    this.id = Command.id++
    this.list = list
    this.command = command
    this.params = params
    this.previous = previous
    this.next = next
  }

  merge(params) {
    this.params = this.params.concat(params)
  }

  reverseCommand() {
    switch (this.command) {
      case 'addTile':
        let textures = this.params
        for(let texture of textures) {
          this.list.map.removeTile(texture)
        }
        break
      case 'load_main_menu':
        break
      case 'main_menu':
        break
      case 'load_map_editor':
        break
      case 'map_editor':
        break
      default:
        console.error(`Trying to undo unknown command: ${this.command}`)
    }
  }

  applyCommand() {
    switch(this.command) {
      case 'addTile':
        let textures = this.params
        for(let texture of textures) {
          this.list.map.addTileFromHistory(texture)
        }
        break
      default:
        console.error(`Trying to redo unknown command: ${this.command}`)
    }
  }
}

class CommandHistory {
  constructor(map) {
    this.map = map
    this.head = null
    this.tail = null
    this.current = null
    this.length = 0
  }

  print() {
    let current = this.head
    let str = ''
    while(current) {
      if (current.id == this.head.id)
        str += "HEAD"
      else if (this.current && current.id == this.current.id)
        str += "CURRENT"
      else if (current.id == this.tail.id)
        str += "TAIL"
      else
        str += current.id

      str += "-" + current.params.length

      if(current.next)
        str += " --> "
      current = current.next
    }
      console.log(str)
  }

  push(commandString, params) {
    let command = new Command(this, this.current, null, commandString, params)

    if(!this.head)
      this.head = command

    if(this.tail) {
      this.tail.next = command
      command.previous = this.tail
    }
    this.tail = command

    if(this.length > 40)
      this.head = this.head.next
    else
      this.length++

    this.current = this.tail
  }

  merge(params) {
    if(this.current) {
      this.current.merge(params)
    }
  }

  undo() {
    if(this.current) {
      this.current.reverseCommand()
      this.current = this.current.previous
      this.length--
    }
    this.print()
  }

  redo() {
    if(this.current) {
      if (this.current.next) {
        this.current = this.current.next
        this.current.applyCommand()
        this.length++
      }
    }
    else if(this.head) {
      this.current = this.head
      this.current.applyCommand()
      this.length = 1
    }
    this.print()
  }
}

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
    this.commandHistory = new CommandHistory(this)
  }

  addTile(_texture, addToLastCommand) {
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
    if(addToLastCommand) {
      this.commandHistory.merge([texture])
    }
    else {
      this.commandHistory.push("addTile", [texture])
    }
    //this.layout[column][row] = texture.key
  }

  addTileFromHistory(texture) {
    let column = Math.trunc(texture.pos.x / texture.width)
    let row = Math.trunc(texture.pos.y / texture.height)
    this.map[column][row] = texture
  }

  removeTile(texture) {
    let column = Math.trunc(texture.pos.x / texture.width)
    let row = Math.trunc(texture.pos.y / texture.height)
    this.map[column][row] = undefined
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
