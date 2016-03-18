import { Entity } from './entity'
import * as Collision from './collision'

class UIElement extends Entity {
  constructor(properties) {
    let entityProps = UIElement.calculateDimensionAndPosition(properties)
    super(entityProps.x, entityProps.y, entityProps.width, entityProps.height)
    this.parent = entityProps.parent
    this.color = properties["color"] || "#ffffff"
    this.backgroundColor = properties["backgroundColor"] || '#2a1d16'
    this.borderWidth = properties["borderWidth"] || 0
    this.visible = properties["visible"] || true

    this.children = []
    let lastChild = null
    for(childKey of Object.keys(properties["children"])) {
      let childProperties = properties["children"][1]
      childProperties["parent"] = this
      childProperties["previousSibling"] = lastChild
      let child = new properties["children"][0](childProperties)
      this.children.push(child)
      lastChild = child
    }
  }

  static calculateDimensionAndPosition(properties) {
    let parent = properties["parent"] || Game.canvas
    let margin = properties["margin"] || 0
    let leftMargin = properties["leftMargin"] || margin
    let rightMargin = properties["rightMargin"] || margin
    let topMargin = properties["topMargin"] || margin
    let bottomMargin = properties["bottomMargin"] || margin
    let display = properties["display"] || "block"
    let previousSibling = properties["previousSibling"]

    let x, y, height, width

    if(typeof properties["width"] == "string") {
      let widthPercent = properties["width"].slice(0, -1)
      width = parent.width * (parseInt(widthPercent) / 100)
    }
    else if (typeof properties["width"] == "number") {
      width = properties["width"]
    }
    else {
      width = parent.width
    }

    if(typeof properties["height"] == "string") {
      let heightPercent = properties["height"].slice(0, -1)
      height = parent.height * parseInt(heightPercent)
    }
    else if (typeof properties["height"] == "number") {
      height = properties["height"]
    }
    else {
      height = parent.height
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

class Grid extends UIElement {
  constructor (properties) {
    super(properties)

    let rowIndex = 0

    for(let row of this.children) {
      row.pos.x = this.pos.x
      row.pos.y = this.pos.y + (row.height * i)
      rowIndex++

      let columnIndex = 0
      for(let column of row) {
        column.pos.x = this
        row.pos.y = this.pos.y + (row.height * i)
        columnIndex++
      }
    }
  }
}

class ProgressBar extends UIElement {
  constructor (properties) {
    super(properties)
    this.total = properties["total"]
    this.progress = 0
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

class Button extends Entity {
  constructor(properties) {
    super(properties)
    this.text = properties["text"]
    this.clickAction = properties["clickAction"]
    this.clicked = false
    this.hoveredBackgroundColor = properties["hoveredBackgroundColor"] || "#da8e42"
    this.clickedBackgroundColor = properties["clickedBackgroundColor"] || "#bb4a00"
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
    this.ctx.fillStyle = this.color
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

let UI = { Button, ProgressBar }

export { UI }
