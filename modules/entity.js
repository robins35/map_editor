export class Entity {
  constructor (x, y) {
    this.id = Entity.id++
    this.pos = { x, y }
    this.canvas = window.game.canvas
    this.ctx = window.game.ctx
  }

  move (x, y) {
    this.pos = { x, y}
  }
}

Entity.id = 1
