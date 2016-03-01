import { Entity } from './entity'
import { Map } from './map'

let canvas = undefined
let ctx = undefined
let grid = undefined
let map = new Map()

class Grid extends Entity {
  constructor(size = 32) {
    super(0, 0)
    this.size = size
    this.color = "#cccccc"
  }

  draw() {
    ctx.beginPath()
    for(let x = 0; x <= canvas.width; x += this.size) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
    }

    for(let y = 0; y <= canvas.height; y += this.size) {
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
    }

    ctx.strokeStyle = this.color
    ctx.stroke()
  }
}

let init = () => {
  ctx = Game.ctx
  canvas = Game.canvas
  grid = new Grid()
  Game.sprites.push(grid)
}



export { init }
