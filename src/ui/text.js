import UIElement from './ui_element'
import * as Collision from '../collision'

const DEFAULT_FONT_SIZE = 12
const DEFAULT_TEXT_MARGIN = 0

export default class Text extends UIElement {
  constructor(canvas, properties) {
    Text.setTextSizeAndWidthHeight(properties)

    super(canvas, properties)
    this.name = "UI.Text"
    this.event_object = properties["event_object"]
    this.text = properties["text"]
    this.selectable = properties["selectable"] || false
    this.clickAction = properties["clickAction"]
    this.clicked = false
    this.color = properties["color"] || "#000000"

    this.selectedBackgroundColor = properties["selectedBackgroundColor"] ||
      Text.invertedColor(this.backgroundColor)
    this.selectedColor = properties["selectedColor"] ||
      Text.invertedColor(this.color)

    this.fontSize = properties["fontSize"] || DEFAULT_FONT_SIZE
    this.font = this.fontSize + "px " + (properties["font"] || 'amatic-bold')
    this.textMargin = properties["textMargin"] || DEFAULT_TEXT_MARGIN
    Text.selectedTexts = {}
  }

  static setTextSizeAndWidthHeight(properties) {
    // This is against the rules, I shouldn't be able to reference "Game" in
    // any of the UI files, since I want it to be a standalone library. I will
    // have to find a solution for this, like initializing the module with
    // canvas and ctx properties.
    let fontSize = properties["fontSize"] || DEFAULT_FONT_SIZE
    let font = fontSize + "px " + (properties["font"] || 'amatic-bold')
    Game.ctx.font = font
    let textMargin= properties["textMargin"] || DEFAULT_TEXT_MARGIN

    properties["textSize"] = Game.ctx.measureText(properties["text"])

    if(properties["width"] == undefined && properties["height"] == undefined) {
      properties["width"] = properties["textSize"].width + (2 * textMargin)
      properties["height"] = fontSize + (2 * textMargin)
    }
  }

  static invertedColor(color) {
    // Stubbing for now, this should invert the rgb bits
    return color
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
    }


    this.ctx.fillStyle = this.color
    this.ctx.font = this.font
    this.ctx.textBaseline = "top"
    this.ctx.fillText(this.text, this.pos.x, this.pos.y)
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
