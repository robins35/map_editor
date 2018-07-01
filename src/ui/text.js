import UIElement from './ui_element'
import * as Collision from '../collision'

const DEFAULT_FONT_SIZE = 12
const DEFAULT_MARGIN = 0

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

    this.backgroundColor = properties["backgroundColor"] ||
      (this.selectable ? Text.invertedColor(this.color) : undefined)

    if(this.selectable) {
      this.selectedBackgroundColor = properties["selectedBackgroundColor"] ||
        // Text.invertedColor(this.backgroundColor) ||
        this.color
      this.selectedColor = properties["selectedColor"] ||
        // Text.invertedColor(this.color) ||
        this.backgroundColor
    }

    this.fontSize = properties["fontSize"] || DEFAULT_FONT_SIZE
    this.font = this.fontSize + "px " + (properties["font"] || 'amatic-bold')
    this.margin = properties["margin"] || DEFAULT_MARGIN
    this.textBaseline = properties["textBaseline"] || "hanging"
    this.textSize = properties["textSize"]
  }

  static setTextSizeAndWidthHeight(properties) {
    // This is against the rules, I shouldn't be able to reference "Game" in
    // any of the UI files, since I want it to be a standalone library. I will
    // have to find a solution for this, like initializing the module with
    // canvas and ctx properties.
    let fontSize = properties["fontSize"] || DEFAULT_FONT_SIZE
    let font = fontSize + "px " + (properties["font"] || 'amatic-bold')
    Game.ctx.font = font
    let margin = properties["margin"] || DEFAULT_MARGIN

    properties["textSize"] = Game.ctx.measureText(properties["text"])

    if(properties["width"] == undefined && properties["height"] == undefined) {
      properties["width"] = properties["textSize"].width// + (2 * margin)
      properties["height"] = fontSize// + (2 * margin)
    }
  }

  static invertedColor(color) {
    let invertedRGB = color.slice(1).match(/.{2}/g).
      map(hex => {
        let hexString = (255 - parseInt(hex, 16)).toString(16)
        if(hexString.length == 1)
          hexString = "0" + hexString
        return hexString
      })

    return `#${invertedRGB.join('')}`
  }

  draw () {
    if(this.visible) {
      let color = this.color
      this.ctx.beginPath()

      if(this.selectable) {
        if(this.parent.selectedItem && this.parent.selectedItem.id == this.id) {
          color = this.selectedColor
          this.ctx.fillStyle = this.selectedBackgroundColor
        }
        else {
          this.ctx.fillStyle = this.backgroundColor
        }
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
      }


      // if(this.borderWidth) {
      //   if(this.border) {
      //     this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height)
      //   else if(this.
      //   this.ctx.lineWidth = this.borderWidth
      //   this.ctx.strokeStyle = this.color
      //   this.ctx.stroke()
      // }

      this.ctx.fillStyle = color
      this.ctx.font = this.font
      this.ctx.textBaseline = this.textBaseline
      if(this.textBaseline == "middle")
        this.ctx.fillText(this.text, this.pos.x, this.pos.y + (this.height / 2))
      else
        this.ctx.fillText(this.text, this.pos.x, this.pos.y)
    }
  }

  update() {
    if(this.hasFocus) {
      if(this.selectable) {
        if (Collision.intersects(this, this.event_object.mouse)) {
          $(this.canvas).css({'cursor' : 'pointer'})
          if (this.event_object.mouse.clicked &&
                (this.parent.selectedItem == undefined ||
                this.parent.selectedItem.id != this.id)) {
            this.parent.selectedItem = this
            this.clickAction()
            this.event_object.mouse.clicked = false
          }
        }
      }
    }
  }
}
