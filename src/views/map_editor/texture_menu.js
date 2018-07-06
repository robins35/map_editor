import UI from 'ui'
import Texture from 'texture'
import * as Collision from 'collision'

export default class TextureMenu extends UI.UIElement {
  constructor(canvas, properties) {
    super(canvas, properties)
    this.name = "UI.TextureMenu"
    this.textures = properties['textures']
    this.selectedTexture = null
    this.textureWidth = this.textures[Object.keys(this.textures)[0]].width
    this.setupMenuProperties()
    this.texturesPerPage = this.textureColumnCount * this.textureRowCount

    this.initTextureObjects()
    this.totalPages = this.textureObjects.length
    this.page = 0
    this.setupIcons()
  }

  setupMenuProperties() {
    this.imagePadding = 5
    let minimumLeftPadding = 80
    let minimumRightPadding = 40
    let minimumTextureRowWidth = this.width - (minimumLeftPadding + minimumRightPadding)
    this.textureColumnCount = Math.trunc(minimumTextureRowWidth / (this.textureWidth + this.imagePadding))
    let textureRowWidth = (this.textureColumnCount * (this.textureWidth + this.imagePadding)) - this.imagePadding

    let minimumTextureRowHeight = this.height - (this.imagePadding*2)
    this.textureRowCount = Math.trunc(minimumTextureRowHeight / (this.textureWidth + this.imagePadding))
    let textureRowHeight = (this.textureRowCount * (this.textureWidth + this.imagePadding)) - this.imagePadding

    this.rightPadding = (this.width - textureRowWidth) / 3
    this.leftPadding = this.rightPadding * 2
    this.topBottomPadding = (this.height - textureRowHeight) / 2
  }

  setupIcons() {
    let allIcons = Game.AssetManager.imgs["icons"]
    this.icons = {}

    let icon = allIcons["left_arrow"]
    icon.pos = { x: this.imagePadding, y: (this.pos.y + (this.height / 2)) - (icon.height / 2) }
    icon.clickAction = this.previousPage.bind(this)
    if(this.page <= 0) icon.hidden = true
    this.icons["left_arrow"] = icon

    icon = allIcons["right_arrow"]
    icon.pos = { x: (this.width - icon.width) - this.imagePadding, y: (this.pos.y + (this.height / 2)) - (icon.height / 2) }
    icon.clickAction = this.nextPage.bind(this)
    if(this.page >= (this.totalPages - 1)) icon.hidden = true
    this.icons["right_arrow"] = icon

    icon = allIcons["eraser"]
    let eraserPadding = this.rightPadding - this.imagePadding
    icon.pos = { x: eraserPadding, y: (this.pos.y + (this.height / 2)) - (icon.height / 2) }
    icon.clickAction = this.setErase.bind(this)
    this.icons["eraser"] = icon
  }

  initTextureObjects() {
    let x = this.pos.x + this.leftPadding
    let y = this.pos.y + this.topBottomPadding
    let currentRow = 0
    let currentColumn = 0

    let textureKeys = Object.keys(this.textures)
    let page = 0
    this.textureObjects = [[]]

    for(let key of textureKeys) {
      let texture = new Texture(x, y, key, this.textures[key])
      this.textureObjects[page].push(texture)
      currentColumn++

      x += texture.width + this.imagePadding
      if(currentColumn >= this.textureColumnCount) {
        x = this.pos.x + this.leftPadding
        y += texture.height + this.imagePadding
        currentColumn = 0
        currentRow++
        if(currentRow >= this.textureRowCount) {
          y = this.pos.y + this.topBottomPadding
          currentRow = 0
          page++
          this.textureObjects[page] = []
        }
      }
    }
  }

  updateArrowIcons() {
    if(this.page == (this.totalPages - 1))
      this.icons["right_arrow"].hidden = true
    else
      this.icons["right_arrow"].hidden = false

    if(this.page == 0)
      this.icons["left_arrow"].hidden = true
    else
      this.icons["left_arrow"].hidden = false
  }

  nextPage() {
    if(this.page >= (this.totalPages - 1)) return
    this.page++
    this.updateArrowIcons()
  }

  previousPage() {
    if(this.page <= 0) return
    this.page--
    this.updateArrowIcons()
  }

  setErase() {
    this.selectedTexture = 'eraser'
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)

    for(let texture of this.textureObjects[this.page]) {
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
    if(this.hasFocus) {
      if(Collision.intersects(this, Game.events.mouse)) {
        for(let texture of this.textureObjects[this.page]) {
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

        if(Game.events.mouse.clicked) {
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
}
