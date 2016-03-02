export class Entity {
  constructor (x, y) {
    Entity.id = (Entity.id === undefined) ? 1 : Entity.id
    this.id = Entity.id++
    this.pos = { x, y }
    this.canvas = Game.canvas
    this.ctx = Game.ctx
  }

  move (x, y) {
    this.pos = { x, y }
  }
}
