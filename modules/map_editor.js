import { Entity } from './entity'
import { Map } from './map'
import { ViewPort } from './view_port'

let canvas = undefined
let ctx = undefined
let grid = undefined
let viewPort = undefined
let textureMenu = undefined
let map = undefined

class TextureMenu extends Entity {
  constructor() {
    let height = Game.canvas.height / 5
    let y = Game.canvas.height - height
    super(0, y, Game.canvas.width, height)
    this.backgroundColor = '#381807'
    this.opacity = 0.4
    this.leftRightPadding = 30
    this.imagePadding = 5
    this.textures = Game.AssetManager.imgs["textures"]
  }

  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.globalAlpha = this.opacity
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
    this.ctx.restore()

    let x = this.pos.x + this.leftRightPadding
    let y = this.pos.y + this.imagePadding


    for(let key of Object.keys(this.textures)) {
      let texture = this.textures[key]
      this.ctx.drawImage(texture, x, y, texture.width, texture.height)
      x += texture.width + this.imagePadding
      if((x + texture.width) > (this.width - this.leftRightPadding)) {
        x = this.pos.x + this.leftRightPadding
        y += texture.height + this.imagePadding
        if((y + texture.height + this.imagePadding) > (this.pos.y + this.height))
          break
      }
    }
  }
}

class Grid extends Entity {
  constructor(_viewPort, _textureMenu, size = 32) {
    super(0, 0, canvas.width, textureMenu.pos.y)
    this.size = size
    this.color = "#cccccc"
    this.viewPort = _viewPort
    this.textureMenu = _textureMenu
  }

  draw() {
    ctx.beginPath()
    for(let x = this.pos.x + 0.5; x <= this.width; x += this.size) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, this.height)
    }

    for(let y = this.pos.y + 0.5; y <= this.height; y += this.size) {
      ctx.moveTo(0, y)
      ctx.lineTo(this.width, y)
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
  //grid.update()
}

let init = () => {
  ctx = Game.ctx
  canvas = Game.canvas
  map = new Map(canvas.width * 2, canvas.height * 2)
  viewPort = new ViewPort(map)
  textureMenu = new TextureMenu()
  grid = new Grid(viewPort, textureMenu)
  Game.uiElements.push(textureMenu)
  Game.environmentElements.push(grid)
}

export { init, update }
