class Entity {
  constructor (ctx, x, y) {
    this.ctx = ctx
    this.id = Entity.id++
    this.pos = { x, y }
  }

  move (x, y) {
    this.pos = { x, y}
  }
}

Entity.id = 1

export default class Entity
