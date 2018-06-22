import { Entity } from './entity'
import Map from './map'
import Texture from './texture'
import { ViewPort } from './view_port'
import { MapEditorUI } from './views/map_editor_ui'
import * as Collision from './collision'

const textureSize = 32

let viewPort = undefined

class Grid extends Entity {
  constructor(_map, _viewPort, _textureMenu, _sideMenu, size = 32) {
    let width = Game.canvas.width - _sideMenu.width - (Game.canvas.width % size)
    let height = _textureMenu.pos.y - (_textureMenu.pos.y % size)
    super(_sideMenu.width, 0, width, height)

    this.name = "Grid"
    this.drawWidth = this.canvas.width - _sideMenu.width
    this.drawHeight = _textureMenu.pos.y
    this.drawX = _sideMenu.width
    this.drawY = 0
    this.size = size
    this.color = "#cccccc"
    this.map = _map
    this.viewPort = _viewPort
    this.textureMenu = _textureMenu
    this.sideMenu = _sideMenu
    this.texturePreview = null
    this.lastTexturePlacedAt = null
    this.texturePreviewAlpha = 0.3
    this.undoing = false
    this.redoing = false
    this.addToLastCommand = false
  }

  resetDimensions() {
    let xToRight = this.canvas.width - this.pos.x
    this.width = xToRight - (xToRight % this.size)
    let yToBottom = this.textureMenu.pos.y - this.pos.y
    this.height = yToBottom - (yToBottom % this.size)
  }

  draw() {
    this.ctx.beginPath()
    for(let x = this.pos.x + 0.5; x <= (this.drawWidth + this.drawX); x += this.size) {
      this.ctx.moveTo(x, this.drawY)
      this.ctx.lineTo(x, this.drawHeight)
    }

    for(let y = this.pos.y + 0.5; y <= this.drawHeight; y += this.size) {
      this.ctx.moveTo(this.drawX, y)
      this.ctx.lineTo(this.drawWidth + this.drawX, y)
    }

    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = 1
    this.ctx.stroke()

    if(this.texturePreview && !this.viewPort.positionAtDragStart) {
      this.ctx.save()
      this.ctx.globalAlpha = this.texturePreviewAlpha

      let texture = this.texturePreview
      this.ctx.drawImage(texture.img, texture.pos.x, texture.pos.y, texture.width, texture.height)

      this.ctx.restore()
    }
  }

  update() {
    let xOffset = this.viewPort.pos.x % this.size
    let yOffset = this.viewPort.pos.y % this.size

    let x = this.sideMenu.width + (xOffset ? this.size - xOffset : 0)
    let y = yOffset ? this.size - yOffset : 0
    this.move(x, y)
    this.resetDimensions()

    if(!this.undoing && (Game.events.controlKeysDown[90] || Game.events.keysDown[85])) {
      this.undoing = true
      this.map.commandHistory.undo()
    }
    else if(this.undoing && !(Game.events.controlKeysDown[90] || Game.events.keysDown[85])) {
      this.undoing = false
    }

    if(!this.redoing && (Game.events.controlKeysDown[82] || Game.events.controlKeysDown[89])) {
      this.redoing = true
      this.map.commandHistory.redo()
    }
    else if (this.redoing && !(Game.events.controlKeysDown[82] || Game.events.controlKeysDown[89])) {
      this.redoing = false
    }

    if(this.textureMenu.selectedTexture) {
      if(Collision.intersects(this, Game.events.mouse)) {
        let columnIntersected = Math.trunc((Game.events.mouse.x - this.pos.x) / this.size)
        let rowIntersected = Math.trunc((Game.events.mouse.y - this.pos.y) / this.size)

        let x = this.pos.x + (columnIntersected * this.size)
        let y = this.pos.y + (rowIntersected * this.size)

        if(this.textureMenu.selectedTexture != 'eraser') {
          if(this.texturePreview) {
            this.texturePreview.pos = {x, y}
          }
          else {
            this.texturePreview = new Texture(x, y, this.textureMenu.selectedTexture.key, this.textureMenu.selectedTexture.img)
          }
        }

        if(Game.events.mouse.rightDown) {
          if(!this.lastTexturePlacedAt ||
              !Collision.pointsAreEqual({x, y}, this.lastTexturePlacedAt)) {

            this.lastTexturePlacedAt = {x, y}
            if(this.textureMenu.selectedTexture == 'eraser') {
              if(this.map.removeTile({x, y}, this.addToLastCommand)) {
                this.addToLastCommand = true
              }
            }
            else {
              this.map.addTile(this.texturePreview, this.addToLastCommand)
              this.addToLastCommand = true
            }

          }
        }
        else if(this.lastTexturePlacedAt && !Game.events.mouse.rightDown) {
          this.lastTexturePlacedAt = null
          this.addToLastCommand = false
        }
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
  let ctx = Game.ctx
  let canvas = Game.canvas
  let map = new Map(canvas.width * 2, canvas.height * 2, textureSize)

  let viewPortWidth = canvas.width - (canvas.width / 5)
  let viewPortHeight = canvas.height - (canvas.height / 5)

  viewPort = new ViewPort(viewPortWidth, viewPortHeight, map)
  let textureMenu = new MapEditorUI.TextureMenu(canvas, {
    height: Game.canvas.height - viewPort.height,
    verticalAlignment: "bottom",
    backgroundColor: '#2a1d16',
    textures: Game.AssetManager.imgs["textures"]

  })

  let sideMenu = new MapEditorUI.SideMenu(map, viewPort)

  let grid = new Grid(map, viewPort, textureMenu, sideMenu)

  Game.uiElements.push([textureMenu, sideMenu])
  Game.environmentElements.push([map, grid])
}

export { init, update }
