import { Entity } from './entity'
import { Map, Texture } from './map'
import { ViewPort } from './view_port'
import { UI } from './ui/ui'
import { MiniMap } from './mini_map'
import * as Collision from './collision'

const textureSize = 32

let viewPort = undefined

class SideMenu extends UI.UIElement {
  constructor(canvas, map, viewPort) {
    let properties = {
      backgroundColor: '#dbcdae',
      width: canvas.width - viewPort.width,
      height: viewPort.height,
      alignment: "left",
      verticalAlignment: "top",
      children: [
        {
          className: MiniMap,
          properties: {
            map: map,
            viewPort: viewPort
          }
        },
        {
          className: UI.Grid,
          properties: {
            height: "40%",
            width: "80%",
            rowHeight: 30,
            rowMargin: 10,
            alignment: "center",
            verticalAlignment: "top",
            rows: [
              [
                {
                  className: UI.Button,
                  properties: {text: "Load Map", event_object: Game.events, clickAction: SideMenu.loadMapLoaderMenu}
                }
              ],
              [
                {
                  className: UI.Button,
                  properties: {text: "Save Map", event_object: Game.events, clickAction: SideMenu.saveMap}
                }
              ],
              [
                {
                  className: UI.Button,
                  properties: {text: "Main Menu", event_object: Game.events, clickAction: SideMenu.loadMainMenu}
                }
              ],
            ]
          }
        }
      ]
    }

    super(canvas, properties)
    this.name = "UI.SideMenu"
    this.map = map
  }

  static saveMap() {
    let target = this
    while(target.map === undefined) {
      target = target.parent
    }
    target.map.save()
  }

  static loadMainMenu() {
    Game.setState("load_main_menu")
  }

  static loadMapLoaderMenu() {
    // second param needs to be the properties
    let mapLoaderMenu = new MapLoaderMenu(this.canvas, {})
  }

  static exitMapLoaderMenu() {

  }
}

class MapLoaderMenu extends UI.PopupMenu {
  constructor(canvas, properties) {
    properties["children"] = [
      {
        className: UI.HeaderTitle,
        properties: {
          alignment: "center",
          color: "#000000"
        }
      },
      {
        className: UI.List,
        properties: {
          height: "70%",
          width: "60%",
          rowHeight: 20,
          alignment: "center",
          verticalAlignment: "top",
          items: []
        }
      },
      {
        className: UI.Button,
        properties: {
          text: "Cancel",
          margin: 10,
          alignment: "left",
          event_object: Game.events,
          clickAction: SideMenu.exitMapLoaderMenu
        }
      },
      {
        className: UI.Button,
        properties: {
          text: "Load Map",
          margin: 10,
          alignment: "right",
          event_object: Game.events,
          clickAction: MapLoaderMenu.loadMap
        }
      }
    ]

    super(canvas, properties)
    this.name = "UI.MapLoaderMenu"
    this.page = 1
    this.mapData = []
  }

  getMapsData() {
    $.ajax({
      method: "GET",
      url: '/maps',
      data: { layout: JSON.stringify(this.layout)},
      error: (error) => {
        console.log(`ERROR: response text: ${error.responseText}, status: ${error.status}`)
      },
      success: ((data) => {
        // Going to have to work/modify this data either server side or client side
        mapsUIPreviewData = data
        this.mapData = mapsUIPreviewData
        this.updateMapList()
      }).bind(this)
    });
  }

  updateMapList() {
    this.children[1].items = this.mapData
  }

  static loadMap() {
    // de-serialize the map and load it into the map object here
  }
}

class TextureMenu extends UI.UIElement {
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

class Grid extends Entity {
  constructor(_map, _viewPort, _textureMenu, _sideMenu, size = 32) {
    super(_sideMenu.width, 0, properties["canvas"].width - _sideMenu.width - (properties["canvas"].width % size),
        _textureMenu.pos.y - (_textureMenu.pos.y % size))
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
  let textureMenu = new TextureMenu(canvas, {
    height: Game.canvas.height - viewPort.height,
    verticalAlignment: "bottom",
    backgroundColor: '#2a1d16',
    textures: Game.AssetManager.imgs["textures"]

  })

  let sideMenu = new SideMenu(canvas, map, viewPort)

  let grid = new Grid(map, viewPort, textureMenu, sideMenu)

  Game.uiElements.push([textureMenu, sideMenu])
  Game.environmentElements.push([map, grid])
}

export { init, update }
