import { Entity } from './entity'
import { Map, Texture } from './map'
import { ViewPort } from './view_port'
import * as Collision from './collision'

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
    this.selectedTexture = null
    this.textureWidth = this.textures[Object.keys(this.textures)[0]].width
    this.setupMenuProperties()
    this.texturesPerPage = this.textureColumnCount * this.textureRowCount
    this.totalPages = Math.ceil(Object.keys(this.textures).length / this.texturesPerPage)
    this.page = 1

    this.setupIcons()

    this.loadTextureObjects()
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
    this.icons = {}

    let icon = allIcons["left_arrow"]
    icon.pos = { x: this.imagePadding, y: (this.pos.y + (this.height / 2)) - (icon.height / 2) }
    icon.clickAction = this.previousPage.bind(this)
    if(this.page <= 1) icon.hidden = true
    this.icons["left_arrow"] = icon

    icon = allIcons["right_arrow"]
    icon.pos = { x: (this.width - icon.width) - this.imagePadding, y: (this.pos.y + (this.height / 2)) - (icon.height / 2) }
    icon.clickAction = this.nextPage.bind(this)
    if(this.page >= this.totalPages) icon.hidden = true
    this.icons["right_arrow"] = icon
  }

  loadTextureObjects() {
    let x = this.pos.x + this.leftRightPadding
    let y = this.pos.y + this.topBottomPadding
    let currentRow = 0
    let currentColumn = 0

    this.textureObjects = []

    let sliceStart = (this.page - 1) * this.texturesPerPage
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

  updateArrowIcons() {
    if(this.page == this.totalPages)
      this.icons["right_arrow"].hidden = true
    else
      this.icons["right_arrow"].hidden = false

    if(this.page == 1)
      this.icons["left_arrow"].hidden = true
    else
      this.icons["left_arrow"].hidden = false
  }

  nextPage() {
    if(this.page >= this.totalPages) return
    this.page++
    this.updateArrowIcons()
    this.loadTextureObjects()
  }

  previousPage() {
    if(this.page <= 1) return
    this.page--
    this.updateArrowIcons()
    this.loadTextureObjects()
  }

  draw() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.globalAlpha = this.opacity
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
    this.ctx.restore()

    for(let texture of this.textureObjects) {
      this.ctx.drawImage(texture.img, texture.pos.x, texture.pos.y, texture.width, texture.height)
      if(this.selectedTexture && this.selectedTexture.id == texture.id) {
        this.ctx.lineWidth = 3
        this.ctx.strokeStyle = "#00ff00"
        this.ctx.strokeRect(texture.pos.x, texture.pos.y, texture.width, texture.height)
      }
      if(texture.hovering && (!this.selectedTexture ||
            (this.selectedTexture &&
              this.selectedTexture.id != texture.id))) {
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = "#90c3d4"
        this.ctx.strokeRect(texture.pos.x, texture.pos.y, texture.width, texture.height)
      }
    }

    for(let iconKey of Object.keys(this.icons)) {
      let icon = this.icons[iconKey]
      if(!icon.hidden)
        this.ctx.drawImage(icon, icon.pos.x, icon.pos.y, icon.width, icon.height)
    }
  }

  update() {
    if(Collision.intersects(this, Game.events.mouse)) {
      for(let texture of this.textureObjects) {
        if(Collision.intersects(texture, Game.events.mouse)) {
          texture.hovering = true
          if(Game.events.mouse.clicked) {
            this.selectedTexture = texture
          }
        }
        else {
          texture.hovering = false
        }
      }

      if(Game.events.mouse.clicked && Collision.intersects(this, Game.events.mouse)) {
        Game.events.mouse.clicked = false
        for(let iconKey of Object.keys(this.icons)) {
          let icon = this.icons[iconKey]
          if(!icon.hidden && Collision.intersects(icon, Game.events.mouse))
            icon.clickAction()
        }
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
    this.texturePreview = null
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

    if(this.texturePreview && !this.viewPort.positionAtDragStart) {
      this.ctx.save()
      this.ctx.globalAlpha = 0.3

      let texture = this.texturePreview
      this.ctx.drawImage(texture.img, texture.pos.x, texture.pos.y, texture.width, texture.height)

      this.ctx.restore()
    }
  }

  update() {
    let xOffset = this.viewPort.pos.x % this.size
    let yOffset = this.viewPort.pos.y % this.size

    let x = xOffset ? this.size - xOffset : 0
    let y = yOffset ? this.size - yOffset : 0
    this.move(x, y)

    if(this.textureMenu.selectedTexture) {
      if(Collision.intersects(this, Game.events.mouse)) {
        let columnIntersected = Math.trunc((Game.events.mouse.x - this.pos.x) / this.size)
        let rowIntersected = Math.trunc((Game.events.mouse.y - this.pos.y) / this.size)

        let x = this.pos.x + (columnIntersected * this.size)
        let y = this.pos.y + (rowIntersected * this.size)
        this.texturePreview = new Texture(x, y, this.textureMenu.selectedTexture.img)
      }
      else {
        this.texturePreview = null
      }
    }
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
