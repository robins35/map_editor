import { Entity } from 'entity'
import * as Collision from 'collision'
import Iso from 'isometric'

export class ViewPort extends Entity {
  constructor(width, height, map) {
    super(0, 0, width, height)
    this.name = "ViewPort"
    this.relativePos = {
      x: Game.canvas.width - width,
      y: 0
    }
    this.speed = 2
    this.positionAtDragStart = null
    this.map = map
    this.map.viewPort = this
  }

  maxX() {
    return this.map.width - this.width
  }

  maxY() {
    return this.map.height - this.height
  }

  moveToObject(pos) {
    if (!Collision.intersects(this, pos)) {
      let x = pos.x - (this.width / 2)
      let y = pos.y - (this.height / 2)

      this.safeMove(x, y)
    }
  }

  isoPos() {
    Iso.cartToIso(this.pos)
  }

  cartPos() {
    Iso.isoToCart(this.pos)
  }

  update() {
    if(this.hasFocus) {
      if(Game.events.keysDown[37])
        this.safeMove(this.pos.x - this.speed, this.pos.y)

      if(Game.events.keysDown[38]) 
        this.safeMove(this.pos.x, this.pos.y - this.speed)

      if(Game.events.keysDown[39])
        this.safeMove(this.pos.x + this.speed, this.pos.y)

      if(Game.events.keysDown[40])
        this.safeMove(this.pos.x, this.pos.y + this.speed)

      if(Game.state == 'map_editor' && Game.events.mouse.dragging) {
        let dragStartPositionOnMap = Game.events.mouse.dragStart
        if(Collision.intersects(this, dragStartPositionOnMap, 0, true)) {
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
      }
      else {
        this.positionAtDragStart = null
      }
    }
  }
}
