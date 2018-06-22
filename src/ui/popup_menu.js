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
      marginTop: properties["headerText"] ? 50 : 0
    }

    super(canvas, Object.assign(defaultProperties, properties), skipChildCreation)
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

      this.ctx.fillStyle = this.color
      this.ctx.font = this.font
      this.ctx.textBaseline = "top"

      let textSize = this.ctx.measureText(this.headerText)
      let textX = this.pos.x + (this.width / 2) - (textSize.width / 2)
      let textY = this.pos.y + this.textMargin

      this.ctx.fillText(this.text, textX, textY)

      for(let child of this.children) {
        child.draw()
      }
    }
  }
}
