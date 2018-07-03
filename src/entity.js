export class Entity {
  constructor (x, y, width, height) {
    Entity.id = (Entity.id === undefined) ? 1 : Entity.id
    this.name = "Entity"
    this.id = Entity.id++
    this.pos = { x, y }
    this.width = width
    this.height = height
    this.canvas = Game.canvas
    this.ctx = Game.ctx
    this.hasFocus = true
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

export class EntityList {
  constructor() {
    this.list = {}
    this.hasFocus = true
  }

  push(entity) {
    if(entity instanceof Array) {
      for(let _entity of entity) {
        this.push(_entity)
      }
    }
    else {
      this.list[entity.id] = entity
    }
  }

  remove(entity) {
    delete this.list[entity.id]
  }

  fetchFirstOccurenceByName(name) {
    let elementId = Object.keys(this.list).find(key => (
      this.list[key].name === name
    ));

    return this.list[elementId]
  }

  draw() {
    for(let key of Object.keys(this.list)) {
      if (this.list[key].draw != undefined)
        this.list[key].draw()
    }
  }

  update() {
    if(this.hasFocus) {
      for(let key of Object.keys(this.list)) {
        if (this.list[key] == undefined) {
          continue
        }
        if (this.list[key].update != undefined)
          this.list[key].update()
      }
    }
  }

  focus() {
    this.hasFocus = true
  }

  unFocus() {
    this.hasFocus = false
  }

  restoreFocus() {
    this.focus()

    for(let entityKey in this.list) {
      this.list[entityKey].hasFocus = true
    }
  }

  disableFocusExcept(exceptionId) {
    for(let key in this.list) {
      if(key == exceptionId)
        continue

      this.list[key].hasFocus = false
    }
  }

  clear() {
    this.list = {}
  }
}
