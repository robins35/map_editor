export class Entity {
  constructor (x, y) {
    this.id = Entity.id++
    this.pos = { x, y }
    this.canvas = Game.canvas
    this.ctx = Game.ctx
  }

  move (x, y) {
    this.pos = { x, y}
  }
}

Entity.id = 1
