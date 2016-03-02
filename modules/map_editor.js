import { Entity } from './entity'
import { Map } from './map'
import { ViewPort } from './view_port'

let canvas = undefined
let ctx = undefined
let grid = undefined
let viewPort = undefined
let map = undefined

class Grid extends Entity {
  constructor(_viewPort, size = 32) {
    super(0, 0)
    this.size = size
    this.color = "#cccccc"
    this.viewPort = _viewPort
  }

  draw() {
    ctx.beginPath()
    for(let x = this.pos.x + 0.5; x <= canvas.width; x += this.size) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
    }

    for(let y = this.pos.y + 0.5; y <= canvas.height; y += this.size) {
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
    }

    ctx.strokeStyle = this.color
    ctx.lineWidth = 1
    ctx.stroke()
  }

  update() {
    let x = this.size - (this.viewPort.pos.x % this.size)
    let y = this.size - (this.viewPort.pos.y % this.size)
    this.move(x, y)
  }
}

let update = () => {
  viewPort.update()
  grid.update()
}

let init = () => {
  ctx = Game.ctx
  canvas = Game.canvas
  map = new Map(canvas.width * 2, canvas.height * 2)
  viewPort = new ViewPort(map)
  grid = new Grid(viewPort)
  Game.sprites.push(grid)
}

export { init, update }
