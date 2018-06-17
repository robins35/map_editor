import { Entity } from './entity'
import * as Collision from './collision'

class UIElement extends Entity {
  constructor(properties) {
    let entityProps = UIElement.calculateDimensionAndPosition(properties)
    super(entityProps.x, entityProps.y, entityProps.width, entityProps.height)
    this.parent = entityProps.parent
    this.color = properties["color"] || "#ffffff"
    this.backgroundColor = properties["backgroundColor"]
    this.borderWidth = properties["borderWidth"] || 0
    this.visible = properties["visible"] || true

    this.children = []
    let lastChild = null
    if(properties["children"]) {
      for(let childKey of Object.keys(properties["children"])) {
        let childProperties = properties["children"][childKey][1]
        childProperties["parent"] = this
        childProperties["previousSibling"] = lastChild
        let child = new properties["children"][childKey][0](childProperties)
        this.children.push(child)
        lastChild = child
      }
    }
  }

  static pixelDimension(value, parentValue) {
    if(typeof value == "string") {
      let valuePercent = value.slice(0, -1)
      value = parentValue * (parseInt(valuePercent) / 100)
    }
    else if (value === undefined) {
      value = parentValue
    }
    return value
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
    let position = properties["position"]

    let x, y, height, width

    width = UIElement.pixelDimension(properties["width"], parent.width)
    height = UIElement.pixelDimension(properties["height"], parent.height)

    if(position) {
      x = position.x
      y = position.y
    }
    else {
      switch (properties["alignment"]) {
        case "center":
          x = parent.pos.x + ((parent.width / 2) - (width / 2))
          break
        case "right":
          x = (parent.pos.x + parent.width - width) - (rightMargin || margin)
          break
        default:
          if(display == 'block' || !previousSibling) {
            x = parent.pos.x + leftMargin
          }
          else {
            x = previousSibling.pos.x + previousSibling.width + leftMargin
          }
      }

      switch (properties["verticalAlignment"]) {
        case "middle":
          y = parent.pos.y + ((parent.height / 2) - (height / 2))
          break
        case "bottom":
          y = (parent.pos.y + parent.height - height) - (topMargin || margin)
          break
        default:
          if(display == 'block' && previousSibling) {
            y = previousSibling.pos.y + previousSibling.height + topMargin
          }
          else {
            y = parent.pos.y + topMargin
          }
      }
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
      if(this.backgroundColor) {
        this.ctx.fillStyle = this.backgroundColor
        this.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
      }

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
    properties["children"] = []
    let height = UIElement.pixelDimension(properties["height"],
        (properties["parent"]|| Game.canvas).height)
    let rowHeight = properties["rowHeight"] || parseInt(height / properties["rows"].length)

    let width = UIElement.pixelDimension(properties["width"],
        (properties["parent"]|| Game.canvas).width)
    let columnWidth = parseInt(width / properties["rows"][0].length)

    let rowMargin = properties["rowMargin"] || 0
    let columnMargin = properties["columnMargin"] || 0

    for(let row of properties["rows"]) {
      let columnIndex = 0
      for(let column of row) {
        if(columnIndex < (row.length - 1)) {
          column[1]['display'] = 'inline'
        }
        column[1]["height"] = rowHeight
        column[1]["width"] = columnWidth
        column[1]["topMargin"] = rowMargin
        column[1]["bottomMargin"] = rowMargin
        column[1]["margin"] = columnMargin
        properties["children"].push(column)
        columnIndex++
      }
    }
    super(properties)
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

class Button extends UIElement {
  constructor(properties) {
    super(properties)
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

let UI = { UIElement, Button, ProgressBar, Grid }

export { UI }
