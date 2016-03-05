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
    this.setupMenuProperties()
    this.texturesPerPage = this.textureColumnCount * this.textureRowCount

    this.setupIcons()

    this.loadTextureObjects(1)
  }

  setupMenuProperties() {
    this.imagePadding = 5
    let minimumTextureRowWidth = this.width - 80
    this.textureColumnCount = Math.trunc(minimumTextureRowWidth / (this.textureWidth + this.imagePadding))
    let textureRowWidth = (this.textureColumnCount * (this.textureWidth + this.imagePadding)) - this.imagePadding

    let minimumTextureRowHeight = this.height - (this.imagePadding*2)
    this.textureRowCount = Math.trunc(minimumTextureRowHeight / (this.textureWidth + this.imagePadding))
    let textureRowHeight = (this.textureRowCount * (this.textureWidth + this.imagePadding)) - this.imagePadding

    this.leftRightPadding = (this.width - textureRowWidth) / 2
    this.topBottomPadding = (this.height - textureRowHeight) / 2
  }

  setupIcons() {
    let allIcons = Game.AssetManager.imgs["icons"]
    this.icons = []

    let icon = allIcons["left_arrow"]
    icon.pos = { x: this.imagePadding, y: (this.pos.y + (this.height / 2)) - (icon.height / 2) }
    this.icons.push(icon)

    icon = allIcons["right_arrow"]
    icon.pos = { x: (this.width - icon.width) - this.imagePadding, y: (this.pos.y + (this.height / 2)) - (icon.height / 2) }
    this.icons.push(icon)
  }

  loadTextureObjects(page) {
    let x = this.pos.x + this.leftRightPadding
    let y = this.pos.y + this.topBottomPadding
    let currentRow = 0
    let currentColumn = 0

    this.textureObjects = []

    let sliceStart = (page - 1) * this.texturesPerPage
    let textureKeys = Object.keys(this.textures).slice(sliceStart, sliceStart + this.texturesPerPage)

    for(let key of textureKeys) {
      let texture = new Texture(x, y, this.textures[key])
      this.textureObjects.push(texture)
      currentColumn++

      x += texture.width + this.imagePadding
      if(currentColumn >= this.textureColumnCount) {
        x = this.pos.x + this.leftRightPadding
        y += texture.height + this.imagePadding
        currentColumn = 0
        currentRow++
        if(currentRow >= this.textureRowCount)
          break
      }
    }
  }

  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.globalAlpha = this.opacity
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
    this.ctx.restore()

    for(let texture of this.textureObjects)
      this.ctx.drawImage(texture.img, texture.pos.x, texture.pos.y, texture.width, texture.height)

    for(let icon of this.icons)
      this.ctx.drawImage(icon, icon.pos.x, icon.pos.y, icon.width, icon.height)
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
