import UIElement from './ui_element'

export default class PopupMenu extends UIElement {
  constructor(canvas, properties, skipChildCreation = false) {
    let defaultProperties = {
      backgroundColor: '#dbcdae',
      color: '#000000',
      width: canvas.width / 2,
      height: canvas.height * 0.66,
      alignment: "center",
      verticalAlignment: "middle",
    }

    let properties = Object.assign(defaultProperties, properties)

    if(properties["headerText"]) {
      properties["children"].unshift({
        className: UI.Text,
        properties: {
          text: properties["headerText"],
          fontSize: 24,
          textMargin: 20,
          event_object: properties["event_object"]
        }
      })
      properties << {
        className: UI.Button,
        properties: {
          text: "Cancel",
          margin: 10,
          alignment: "left",
          verticalAlignment: "bottom",
          display: "inline",
          event_object: properties["event_object"],
          clickAction: this.exitMapLoaderMenu
      }
    }

    super(canvas, Object.assign(defaultProperties, properties), skipChildCreation)

    // Bind methods to this object so this is the MapLoaderMenu
    this.exitMapLoaderMenu = this.exitMapLoaderMenu.bind(this)

    this.name = "UI.PopupMenu"
    this.fontSize = properties["fontSize"] || 24
    this.font = this.fontSize + "px " + (properties["font"] || 'amatic-bold')
    this.textMargin = properties["textMargin"] || 3
    this.headerText = properties["headerText"]
    this.createChildElements(properties)
  }

  draw() {
    if(this.visible) {
      if(this.borderWidth) {
        this.ctx.beginPath()
        this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height)
        this.ctx.lineWidth = this.borderWidth
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
      }

      if(this.backgroundColor) {
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
      }

      for(let child of this.children) {
        child.draw()
      }
    }
  }

  exitMapLoaderMenu() {
    // Game.uiElements.remove(this)
    delete referenceHash[this]
  }
}
