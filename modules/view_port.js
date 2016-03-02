import { Entity } from './entity'

export class ViewPort extends Entity {
  constructor(map) {
    super(0, 0)
    this.map = map
    this.width = Game.canvas.width
    this.height = Game.canvas.height
    this.speed = 2

    this.maxX = map.width - this.width
    this.maxY = map.height - this.height
  }

  update() {
    if(Game.events.keysDown[37]) {
      this.pos.x -= this.speed
      if(this.pos.x < 0)
        this.pos.x = 0
    }
    if(Game.events.keysDown[38]) {
      this.pos.y -= this.speed
      if(this.pos.y < 0)
        this.pos.y = 0
    }
    if(Game.events.keysDown[39]) {
      this.pos.x += this.speed
      if((this.pos.x + this.width) > this.map.width)
        this.pos.x = this.maxX
    }
    if(Game.events.keysDown[40]) {
      this.pos.y += this.speed
      if((this.pos.y + this.height) > this.map.height)
        this.pos.y = this.maxY
    }
  }
}
