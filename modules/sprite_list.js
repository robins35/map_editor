export class SpriteList {
  constructor() {
    this.list = {}
  }

  push(sprite) {
    if(sprite instanceof Array) {
      for(let _sprite of sprite) {
        this.push(_sprite)
      }
    }
    else {
      this.list[sprite.id] = sprite
    }
  }

  draw() {
    for(let key of Object.keys(this.list)) {
      this.list[key].draw()
    }
  }

  update() {
    for(let key of Object.keys(this.list)) {
      this.list[key].update()
    }
  }

  clear() {
    this.list = {}
  }
}
