export class Entity {
  constructor (x, y, width, height) {
    Entity.id = (Entity.id === undefined) ? 1 : Entity.id
    this.id = Entity.id++
    this.pos = { x, y }
    this.width = width
    this.height = height
    this.canvas = Game.canvas
    this.ctx = Game.ctx
  }

  maxX() {
    return this.canvas.width - this.width
  }

  maxY() {
    return this.canvas.height - this.height
  }

  move (x, y) {
    this.pos = { x, y }
  }

  safeMove (x, y) {
    if(x > this.maxX())
      this.pos.x = this.maxX()
    else if (x < 0)
      this.pos.x = 0
    else
      this.pos.x = x

    if(y > this.maxY())
      this.pos.y = this.maxY()
    else if (y < 0)
      this.pos.y = 0
    else
      this.pos.y = y
  }
}
