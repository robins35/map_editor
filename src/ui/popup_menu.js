import UIElement from './ui_element'
import Button from './button'
import Text from './text'

export default class PopupMenu extends UIElement {
  constructor(canvas, properties, skipChildCreation = false) {
    let defaultProperties = {
      backgroundColor: '#dbcdae',
      color: '#000000',
      width: canvas.width / 2,
      height: canvas.height * 0.66,
      alignment: "center",
      verticalAlignment: "middle",
      disableFocusOnOtherUI: true
    }

    properties = Object.assign(defaultProperties, properties)

    if(properties["headerText"]) {
      properties["children"].unshift({
        className: Text,
        properties: {
          text: properties["headerText"],
          fontSize: 32,
          margin: 6,
          alignment: "center",
          event_object: properties["event_object"]
        }
      })
    }

    if(!properties["cancelButton"]) {
      properties["children"].push({
        className: Button,
        properties: {
          text: properties["cancelButtonText"] || "Cancel",
          margin: 10,
          alignment: "left",
          verticalAlignment: "bottom",
          display: "inline",
          event_object: properties["event_object"],
          clickAction: properties["cancelMethod"] || (() => { this.exitPopup() })
        }
      })
    }
    else {
      properties["children"].push(properties["cancelButton"])
    }

    if(!properties["actionButton"]) {
      properties["children"].push({
        className: Button,
        properties: {
          text: properties["actionButtonText"],
          margin: 10,
          alignment: "right",
          verticalAlignment: "bottom",
          display: "inline",
          event_object: properties["event_object"],
          clickAction: properties["actionButtonMethod"]
        }
      })
    }
    else {
      properties["children"].push(properties["actionButton"])
    }

    super(canvas, Object.assign(defaultProperties, properties), skipChildCreation)

    // Bind methods to this object so 'this' refers to the PopupMenu object
    this.exitPopup = this.exitPopup.bind(this)

    this.name = "UI.PopupMenu"
    this.referenceHash = properties["referenceHash"]
    this.disableFocusHashes = properties["disableFocusHashes"]
    this.disableFocusOnOtherUI = properties["disableFocusOnOtherUI"]
    this.headerText = properties["headerText"]

    this.referenceHash.push(this)
    if(this.disableFocusOnOtherUI)
      this.referenceHash.disableFocusExcept(this.id)

    for(let hash of this.disableFocusHashes) {
      hash.unFocus()
    }
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

  exitPopup() {
    this.referenceHash.remove(this)

    if(this.disableFocusOnOtherUI)
      this.referenceHash.restoreFocus()

    for(let hash of this.disableFocusHashes) {
      hash.focus()
    }
  }
}
