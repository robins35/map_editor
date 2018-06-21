import UIElement from './ui_element'
import * as Collision from '../collision'

export default class Button extends UIElement {
  constructor(canvas, properties) {
    super(canvas, properties)
    this.name = "UI.Button"
    this.event_object = properties["event_object"]
    this.text = properties["text"]
    this.clickAction = properties["clickAction"]
    this.clicked = false
    this.backgroundColor = properties["backgroundColor"] || "#cc6600"
    this.hoveredBackgroundColor = properties["hoveredBackgroundColor"] || "#da8e42"
    this.clickedBackgroundColor = properties["clickedBackgroundColor"] || "#bb4a00"
    this.fontSize = properties["fontSize"] || 24
    this.font = this.fontSize + "px " + (properties["font"] || 'amatic-bold')
    this.textMargin = properties["textMargin"] || 3
    Button.hoveredButtons = {}
    Button.clickedButtons = {}
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

    let textSize = this.ctx.measureText(this.text)
    let textX = this.pos.x + (this.width / 2) - (textSize.width / 2)
    let textY = this.pos.y + (this.height / 2) - (this.fontSize / 2) - this.textMargin

    this.ctx.fillText(this.text, textX, textY)
  }

  update() {
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
