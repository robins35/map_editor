import Texture from './texture'
import * as Collision from './collision'
import { Entity } from './entity'

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
        this.list.map.viewPort.moveToObject(this.params[0].pos)
        setTimeout(function() {
          for(let texture of this.params) {
            this.list.map.removeTileFromHistory(texture)
          }
        }.bind(this), 100)
        break
      case 'eraseTile':
        this.list.map.viewPort.moveToObject(this.params[0].pos)
        setTimeout(function() {
          for(let texture of this.params) {
            this.list.map.addTileFromHistory(texture)
          }
        }.bind(this), 100)
        break
      default:
        console.error(`Trying to undo unknown command: ${this.command}`)
    }
  }

  applyCommand() {
    switch(this.command) {
      case 'addTile':
        this.list.map.viewPort.moveToObject(this.params[0].pos)
        setTimeout(function() {
          for(let texture of this.params) {
            this.list.map.addTileFromHistory(texture)
          }
        }.bind(this), 100)
        break
      case 'eraseTile':
        this.list.map.viewPort.moveToObject(this.params[0].pos)
        setTimeout(function() {
          for(let texture of this.params) {
            this.list.map.removeTileFromHistory(texture)
          }
        }.bind(this), 100)
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

    if(this.current) {
      this.current.next = command
    }

    this.current = command
    this.tail = this.current

    if(this.length > 40)
      this.head = this.head.next
    else
      this.length++
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
  }
}

export default class Map {
  constructor(width, height, textureSize, mapIdentifier = null, viewPort = null) {
    // This could be a very poor way of giving Maps an id, since Maps don't inherit from Entity, but we're using Entity's id system.
    Entity.id = (Entity.id === undefined) ? 1 : Entity.id
    this.id = Entity.id++
    this.mapIdentifier = mapIdentifier

    this.width = Math.trunc(width / textureSize) * textureSize
    this.height = Math.trunc(height / textureSize) * textureSize
    this.textureSize = textureSize
    this.columns = this.width / textureSize
    this.rows = this.height / textureSize
    this.viewPort = viewPort

    this.map = []
    this.layout = []

    for(let column = 0; column < this.columns; column++) {
      this.map[column] = []
      this.layout[column] = []
    }
    this.commandHistory = new CommandHistory(this)
  }

  save() {
    let url = "/maps"

    if(this.mapIdentifier)
      url += `/${this.mapIdentifier}`

    this.serialize()

    $.ajax({
      method: "POST",
      url: url,
      data: { layout: JSON.stringify(this.layout)},
      error: (error) => {
        console.log(`ERROR: response text: ${error.responseText}, status: ${error.status}`)
      },
      success: (data) => {
        this.mapIdentifier = data["map_id"]
        console.log("Set map id to " + this.mapIdentifier)
      }
    });
  }

  serialize() {
    for(let column = 0; column < this.columns; column++) {
      for(let row = 0; row < this.rows; row++) {
        let square = this.map[column][row]
        if(square)
          this.layout[column][row] = square.key
        else
          this.layout[column][row] = null
      }
    }
  }

  extractFromLayout() {
    let textures = Game.AssetManager.imgs["textures"]

    for(let [columnIndex, column] of this.layout.entries()) {
      this.map[columnIndex] = []
      for(let [rowIndex, cell] of column.entries()) {
        if(cell) {
          let x = columnIndex * this.textureSize
          let y = rowIndex * this.textureSize
          let texture = new Texture(x,
                                    y,
                                    cell,
                                    textures[cell])
          this.map[columnIndex][rowIndex] = texture
        }
      }
    }
  }

  loadNewFromLayout(layout, mapIdentifier) {
    let canvas = Game.canvas
    let map = new Map(canvas.width * 2,
                      canvas.height * 2,
                      this.textureSize,
                      mapIdentifier,
                      this.viewPort)

    map.layout = layout
    map.extractFromLayout()
    this.viewPort.map = map

    Game.environmentElements.remove(this)
    Game.environmentElements.push(map)
    return map
  }

  calculateAbsolutePosition(pos) {
    if(this.viewPort) {
      let sideMenuWidth = Game.canvas.width - this.viewPort.width
      var x = this.viewPort.pos.x + (pos.x - sideMenuWidth)
      var y = this.viewPort.pos.y + pos.y
    }
    else {
      var x = pos.x
      var y = pos.y
    }
    return [x, y]
  }

  xyToColRow(pos) {
    let column = Math.trunc(pos.x / this.textureSize)
    let row = Math.trunc(pos.y / this.textureSize)
    return [column, row]
  }

  addTile(_texture, addToLastCommand) {
    let [x, y] = this.calculateAbsolutePosition(_texture.pos)
    let [column, row] = this.xyToColRow({x, y})

    let texture = new Texture(x, y, _texture.key, _texture.img)

    this.map[column][row] = texture
    if(addToLastCommand && this.commandHistory.current.command == 'addTile') {
      this.commandHistory.merge([texture])
    }
    else {
      this.commandHistory.push("addTile", [texture])
    }
  }

  addTileFromHistory(texture) {
    let [column, row] = this.xyToColRow({x: texture.pos.x, y: texture.pos.y})
    this.map[column][row] = texture
  }

  removeTile(relativePos, addToLastCommand) {
    let [x, y] = this.calculateAbsolutePosition(relativePos)
    let [column, row] = this.xyToColRow({x, y})

    let texture = this.map[column][row]
    if(texture === undefined)
      return false
    this.map[column][row] = undefined
    if(addToLastCommand && this.commandHistory.current.command == 'eraseTile') {
      this.commandHistory.merge([texture])
    }
    else {
      this.commandHistory.push("eraseTile", [texture])
    }
    return true
  }

  removeTileFromHistory(texture) {
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
        if(!this.map[column] || !this.map[column][row])
          continue

        let texture = this.map[column][row]

        if(texture === undefined)
          continue

        let absolutePosition = { x: (column * this.textureSize), y: (row * this.textureSize) }
        let pos = Collision.vectorDifference(absolutePosition, this.viewPort.pos)
        let relativePosition = Collision.vectorSum(pos, { x: Game.canvas.width - this.viewPort.width, y: 0 })

        Game.ctx.drawImage(texture.img, relativePosition.x, relativePosition.y,
            texture.width, texture.height)
      }
    }
  }
}

