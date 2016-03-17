import { Entity } from './entity'
import * as Collision from './collision'

class Button extends Entity {

  constructor(x, y, width, height, text, clickAction) {
    super(x, y, width, height)
    this.text = text
    this.clickAction = clickAction
    this.clicked = false
    this.backgroundColor = "#cc6600"
    this.hoveredBackgroundColor = "#da8e42"
    this.clickedBackgroundColor = "#bb4a00"
    this.textColor = "#ffffff"
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

    let fontSize = 24
    this.ctx.fillStyle = this.textColor
    this.ctx.font = fontSize + "px amatic-bold"
    this.ctx.textBaseline = "top"

    let textMargin = 3
    let textSize = this.ctx.measureText(this.text)
    let textX = this.pos.x + (this.width / 2) - (textSize.width / 2)
    let textY = this.pos.y + (this.height / 2) - (fontSize / 2) - textMargin

    this.ctx.fillText(this.text, textX, textY)
  }

  update() {
    if (Collision.intersects(this, Game.events.mouse)) {
      Button.hoveredButtons[this.id] = true
      if (Game.events.mouse.clicked) {
        Button.clickedButtons[this.id] = true
        Game.events.mouse.clicked = false
      }
      else if (Button.clickedButtons[this.id] && !Game.events.mouse.down) {
        delete Button.clickedButtons[this.id]
        this.clickAction()
      }
    }
    else if (Button.hoveredButtons[this.id]) {
      delete Button.hoveredButtons[this.id]
    }
  }
}

class UIElement extends Entity {
  constructor(properties) {
    let entityProps = UIElement.calculateDimensionAndPosition(properties)
    super(entityProps.x, entityProps.y, entityProps.width, entityProps.height)
    this.parent = entityProps.parent
    this.children = properties["children"]
    this.backgroundColor = properties["backgroundColor"] || '#2a1d16'
    this.borderWidth = properties["borderWidth"] || 0
    this.visible = properties["visible"] || true
  }

  static calculateDimensionAndPosition(properties) {
    let parent = properties["parent"] || Game.canvas
    let margin = properties["margin"] || 0
    let leftMargin = properties["leftMargin"] || 0
    let rightMargin = properties["rightMargin"] || 0
    let topMargin = properties["topMargin"] || 0
    let bottomMargin = properties["bottomMargin"] || 0

    let x, y, height, width

    if(typeof properties["width"] == "string") {
      let widthPercent = properties["width"].slice(0, -1)
      width = parent.width * (parseInt(widthPercent) / 100)
    }
    else {
      width = properties["width"]
    }

    if(typeof properties["height"] == "string") {
      let heightPercent = properties["height"].slice(0, -1)
      height = parent.height * parseInt(heightPercent)
    }
    else {
      height = properties["height"]
    }

    switch (properties["alignment"]) {
      case "center":
        x = parent.pos.x + ((parent.width / 2) - (width / 2))
        break
      case "right":
        x = (parent.pos.x + parent.width - width) - (rightMargin || margin)
        break
      default:
        x = parent.pos.x + (leftMargin || margin)
    }

    switch (properties["verticalAlignment"]) {
      case "middle":
        y = parent.pos.y + ((parent.height / 2) - (height / 2))
        break
      case "bottom":
        y = (parent.pos.y + parent.height - height) - (topMargin || margin)
        break
      default:
        y = parent.pos.y + (topMargin || margin)
    }

    return { x, y, width, height, parent }
  }

  show() {
    this.visible = true
  }

  hide() {
    this.visible = false
  }

  toggle() {
    this.visible = !this.visible
  }

  draw() {
    if(this.visible) {
      this.ctx.fillStyle = this.backgroundColor
      this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)

      for(let child of this.children) {
        child.draw()
      }
    }
  }

  update() {
    for(let child of this.children) {
      child.update()
    }
  }
}

class ProgressBar extends UIElement {
  constructor (properties) {
    super(properties)
    this.total = properties["total"]
    this.progress = 0
    this.color = properties["color"]
  }

  draw () {
    this.ctx.beginPath()
    this.ctx.rect(this.pos.x, this.pos.y, this.width, this.height)
    this.ctx.lineWidth = this.borderWidth
    this.ctx.strokeStyle = this.color
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.fillStyle = this.color
    this.ctx.fillRect(this.pos.x, this.pos.y, this.calculateWidth(), this.height)
  }

  calculateWidth() {
    return this.width * (this.progress / this.total)
  }
}

let UI = { Button, ProgressBar }

export { UI }
