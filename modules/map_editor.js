import { Entity } from './entity'
import { Map, Texture } from './map'
import { ViewPort } from './view_port'

let canvas = undefined
let ctx = undefined
let grid = undefined
let viewPort = undefined
let textureMenu = undefined
let map = undefined

class TextureMenu extends Entity {
  constructor(viewPort) {
    let height = Game.canvas.height - viewPort.height
    let y = viewPort.height
    super(0, y, Game.canvas.width, height)
    this.backgroundColor = '#381807'
    this.opacity = 0.4
    this.textures = Game.AssetManager.imgs["textures"]
    this.textureWidth = this.textures[Object.keys(this.textures)[0]].width
    this.imagePadding = 5

    let minimumTextureRowWidth = this.width - 80
    let textureColumnCount = Math.trunc(minimumTextureRowWidth / (this.textureWidth + this.imagePadding))
    let textureRowWidth = textureColumnCount * (this.textureWidth + this.imagePadding)

    let minimumTextureRowHeight = this.height - (this.imagePadding*2)
    let textureRowCount = Math.trunc(minimumTextureRowHeight / (this.textureWidth + this.imagePadding))
    let textureRowHeight = (textureRowCount * (this.textureWidth + this.imagePadding)) - this.imagePadding

    this.leftRightPadding = (this.width - textureRowWidth) / 2
    this.topBottomPadding = (this.height - textureRowHeight) / 2
    this.texturesPerPage = textureColumnCount * textureRowCount

    this.loadTextureObjects(1)
  }

  loadTextureObjects(page) {
    let x = this.pos.x + this.leftRightPadding
    let y = this.pos.y + this.topBottomPadding
    let count = 0

    this.textureObjects = []

    for(let key of Object.keys(this.textures)) {
      let texture = new Texture(x, y, this.textures[key])
      count++

      x += texture.width + this.imagePadding
      if((x + texture.width) > (this.width - this.leftRightPadding)) {
        x = this.pos.x + this.leftRightPadding
        y += texture.height + this.imagePadding
        if(count > this.texturesPerPage)
          break
    }
  }

  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.globalAlpha = this.opacity
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
    this.ctx.restore()

    for(let texture of this.textureObjects) {
      this.ctx.drawImage(texture.img, texture.x, texture.y, texture.width, texture.height)
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
}

let init = () => {
  ctx = Game.ctx
  canvas = Game.canvas
  map = new Map(canvas.width * 2, canvas.height * 2)

  let viewPortWidth = canvas.width
  let viewPortHeight = canvas.height - (canvas.height / 5)

  viewPort = new ViewPort(viewPortWidth, viewPortHeight, map)
  textureMenu = new TextureMenu(viewPort)
  grid = new Grid(viewPort, textureMenu)
  Game.uiElements.push(textureMenu)
  Game.environmentElements.push(grid)
}

export { init, update }
