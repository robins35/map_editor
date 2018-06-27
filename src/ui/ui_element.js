import { Entity } from '../entity'
import * as Collision from '../collision'

export default class UIElement extends Entity {
  // If you create a new object that inherits from UIElement, and it has
  // children, you must add the child info/structure to the properties before
  // calling super
  constructor(canvas, properties, skipChildCreation = false) {
    properties["margin"] = properties["margin"] || 0
    properties["leftMargin"] = properties["leftMargin"] || properties["margin"]
    properties["rightMargin"] = properties["rightMargin"] || properties["margin"]
    properties["topMargin"] = properties["topMargin"] || properties["margin"]
    let entityProps = UIElement.calculateDimensionAndPosition(canvas, properties)
    super(entityProps.x, entityProps.y, entityProps.width, entityProps.height)
    this.name = "UIElement"
    this.canvas = canvas
    this.event_object = properties["event_object"]
    this.parent = entityProps.parent
    this.display = properties["display"] || 'block'
    this.previousSibling = properties["previousSibling"]
    this.margin = properties["margin"]
    this.leftMargin = properties["leftMargin"]
    this.rightMargin = properties["rightMargin"]
    this.topMargin = properties["topMargin"]
    this.color = properties["color"] || "#ffffff"
    this.backgroundColor = properties["backgroundColor"]
    this.borderWidth = properties["borderWidth"] || 0
    this.borderColor = properties["borderColor"] || "#000000"
    this.visible = properties["visible"] == undefined ? true : properties["visible"]

    if(!skipChildCreation)
      this.createChildElements(properties)
  }

  createChildElements(properties) {
    let children = []
    let lastChild = null

    if(properties["children"]) {
      for(let childData of properties["children"]) {
        let childClassName = childData["className"]
        let childProperties = childData["properties"]
        childProperties["parent"] = this
        childProperties["previousSibling"] = lastChild
        let child = childClassName.prototype instanceof UIElement ?
          new childClassName(this.canvas, childProperties) :
          new childClassName(childProperties)
        children.push(child)
        if(child.previousSibling) {
          lastChild["nextSibling"] = child
        }
        lastChild = child
      }
    }
    this.children = children
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

  static calculateDimensionAndPosition(canvas, properties) {
    const parent = properties["parent"] || canvas
    const margin = properties["margin"]
    const leftMargin = properties["leftMargin"]
    const rightMargin = properties["rightMargin"]
    const topMargin = properties["topMargin"]
    const bottomMargin = properties["bottomMargin"]
    const display = properties["display"] || "block"
    const previousSibling = properties["previousSibling"]
    const position = properties["position"]

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
          if(display == 'block' || !previousSibling || previousSibling.display == 'block') {
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
          if(previousSibling) {
            if(display == 'block' || previousSibling.display == "block") {
              y = previousSibling.pos.y +
                previousSibling.height +
                topMargin +
                (previousSibling.bottomMargin || previousSibling.margin || 0)
            }
            else {
              y = (previousSibling.pos.y - previousSibling.topMargin) + topMargin
            }
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

  update() {
    for(let child of this.children) {
      child.update()
    }
  }
}
