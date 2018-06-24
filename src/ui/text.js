import UIElement from './ui_element'
import * as Collision from '../collision'

export default class Text extends UIElement {
  constructor(canvas, properties) {
    super(canvas, properties)
    this.name = "UI.Text"
    this.event_object = properties["event_object"]
    this.text = properties["text"]
    this.selectable = properties["selectable"] || false
    this.clickAction = properties["clickAction"]
    this.clicked = false

    this.selectedBackgroundColor = properties["selectedBackgroundColor"] ||
      this.invertedColor(this.backgroundColor)
    this.selectedColor = properties["selectedColor"] ||
      this.invertedColor(this.color)

    this.fontSize = properties["fontSize"] || 12
    this.font = this.fontSize + "px " + (properties["font"] || 'amatic-bold')
    this.textMargin = properties["textMargin"] || 3
    Text.selectedTexts = {}
  }

  draw () {
    this.ctx.beginPath()
    if(this.selectable) {
      if(Text.selectedTexts[this.id]) {
        this.ctx.fillStyle = this.selectedBackgroundColor
        $(this.canvas).css({'cursor' : 'pointer'})
      }
      else {
        this.ctx.fillStyle = this.backgroundColor
      }
      this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
      this.ctx.fillStyle = this.color
      this.ctx.font = this.font
    }


    this.ctx.textBaseline = "top"
    let textSize = this.ctx.measureText(this.text)
    let textX = this.pos.x + (this.width / 2) - (textSize.width / 2)
    let textY = this.pos.y + (this.height / 2) - (this.fontSize / 2) - this.textMargin

    this.ctx.fillText(this.text, textX, textY)
  }

  update() {
    if(this.selectable) {
      if (Collision.intersects(this, this.event_object.mouse)) {
        if (this.event_object.mouse.clicked) {
          Text.selectedTexts[this.id] = true
          this.event_object.mouse.clicked = false
        }
        else if (Text.selectedTexts[this.id] && !this.event_object.mouse.down) {
          delete Text.selectedTexts[this.id]
          this.clickAction()
        }
      }
    }
  }
}
