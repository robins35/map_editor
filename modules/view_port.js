import { Entity } from './entity'
import * as Collision from './collision'

export class ViewPort extends Entity {
  constructor(map) {
    super(0, 0, Game.canvas.width, Game.canvas.height)
    this.map = map
    this.speed = 2
    this.positionAtDragStart = null
  }

  maxX() {
    return this.map.width - this.width
  }

  maxY() {
    return this.map.height - this.height
  }

  update() {
    if(Game.events.keysDown[37])
      this.safeMove(this.pos.x - this.speed, this.pos.y)

    if(Game.events.keysDown[38]) 
      this.safeMove(this.pos.x, this.pos.y - this.speed)

    if(Game.events.keysDown[39])
      this.safeMove(this.pos.x + this.speed, this.pos.y)

    if(Game.events.keysDown[40])
      this.safeMove(this.pos.x, this.pos.y + this.speed)

    if(Game.events.mouse.dragging) {
      if(this.positionAtDragStart === null) {
        this.positionAtDragStart = Object.assign({}, this.pos)
        $(Game.canvas).css({'cursor' : 'move'})
      }

      let start = Game.events.mouse.dragStart
      let end = { x: Game.events.mouse.x, y: Game.events.mouse.y }
      let moveVector = Collision.vectorDifference(start, end)

      let movePosition = Collision.vectorSum(this.positionAtDragStart, moveVector)
      this.safeMove(movePosition.x, movePosition.y)
    }
    else {
      this.positionAtDragStart = null
    }
  }
}
