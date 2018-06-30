import UIElement from './ui_element'
import * as Collision from '../collision'

const DEFAULT_TEXT_MARGIN_TOP_BOTTOM = 3
const DEFAULT_TEXT_MARGIN_LEFT_RIGHT = 10
const DEFAULT_FONT_SIZE = 24

export default class Button extends UIElement {
  constructor(canvas, properties) {
    Button.setTextSizeAndWidthHeight(properties)

    super(canvas, properties)
    this.name = "UI.Button"
    this.event_object = properties["event_object"]
    this.text = properties["text"]
    this.clickAction = properties["clickAction"]
    this.clicked = false
    this.backgroundColor = properties["backgroundColor"] || "#cc6600"
    this.hoveredBackgroundColor = properties["hoveredBackgroundColor"] || "#da8e42"
    this.clickedBackgroundColor = properties["clickedBackgroundColor"] || "#bb4a00"
    this.fontSize = properties["fontSize"] || DEFAULT_FONT_SIZE
    this.font = this.fontSize + "px " + (properties["font"] || 'amatic-bold')
    this.textSize = properties["textSize"]
    this.textMarginTopBottom = properties["textMarginTopBottom"] || DEFAULT_TEXT_MARGIN_TOP_BOTTOM
    this.textMarginLeftRight = properties["textMarginLeftRight"] || DEFAULT_TEXT_MARGIN_LEFT_RIGHT

    Button.hoveredButtons = {}
    Button.clickedButtons = {}
  }

  static setTextSizeAndWidthHeight(properties) {
    // This is against the rules, I shouldn't be able to reference "Game" in
    // any of the UI files, since I want it to be a standalone library. I will
    // have to find a solution for this, like initializing the module with
    // canvas and ctx properties.
    let fontSize = properties["fontSize"] || DEFAULT_FONT_SIZE
    let font = fontSize + "px " + (properties["font"] || 'amatic-bold')
    Game.ctx.font = font
    let textMarginLeftRight = properties["textMarginLeftRight"] || DEFAULT_TEXT_MARGIN_LEFT_RIGHT
    let textMarginTopBottom = properties["textMarginTopBottom"] || DEFAULT_TEXT_MARGIN_TOP_BOTTOM

    properties["textSize"] = Game.ctx.measureText(properties["text"])

    if(properties["width"] == undefined && properties["height"] == undefined) {
      properties["width"] = properties["textSize"].width + (2 * textMarginLeftRight)
      properties["height"] = fontSize + (2 * textMarginTopBottom)
    }
  }

  draw () {
    this.ctx.beginPath()
    if(Button.hoveredButtons[this.id]) {
      if(Button.clickedButtons[this.id])
        this.ctx.fillStyle = this.clickedBackgroundColor
      else
        this.ctx.fillStyle = this.hoveredBackgroundColor
      $(this.canvas).css({'cursor' : 'pointer'})
    }
    else {
      this.ctx.fillStyle = this.backgroundColor
      if(Object.keys(Button.hoveredButtons).length <= 0)
        $(this.canvas).css({'cursor' : 'default'})
    }
    this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)

    this.ctx.fillStyle = this.color
    this.ctx.font = this.font
    this.ctx.textBaseline = "top"

    let textX = this.pos.x + (this.width / 2) - (this.textSize.width / 2)
    let textY = this.pos.y + (this.height / 2) - (this.fontSize / 2) - this.textMarginTopBottom

    this.ctx.fillText(this.text, textX, textY)
  }

  update() {
    if(this.hasFocus) {
      if (Collision.intersects(this, this.event_object.mouse)) {
        Button.hoveredButtons[this.id] = true
        if (this.event_object.mouse.clicked) {
          Button.clickedButtons[this.id] = true
          this.event_object.mouse.clicked = false
        }
        else if (Button.clickedButtons[this.id] && !this.event_object.mouse.down) {
          delete Button.clickedButtons[this.id]
          this.clickAction()
        }
      }
      else if (Button.hoveredButtons[this.id]) {
        delete Button.hoveredButtons[this.id]
      }
    }
  }
}
