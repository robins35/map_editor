import UIElement from './ui_element'

const DEFAULT_ROW_HEIGHT = 20

export default class List extends UIElement {
  constructor(canvas, properties, skipChildCreation = false) {
    properties["display"] = properties["display"] || "block"
    properties["backgroundColor"] = "#000000"
    properties["color"] = "#00ff00"
    properties["borderWidth"] = 1
    super(canvas, properties, skipChildCreation)
    this.name = "UI.List"

    if(this.items != undefined && this.items.length > 0) {
      super.createChildElements(this)
    }
  }

  createChildElements(properties) {
    this.items = properties["items"]
    this.event_object = properties["event_object"]
    this.rowHeight = properties["rowHeight"] || DEFAULT_ROW_HEIGHT
    this.maxItems = Math.floor(this.height / this.rowHeight)

    this.convertItemsToUIFormat()
    super.createChildElements({ children: this.children })
  }

  convertItemsToUIFormat() {
    let children = []

    for(let [index, item] of this.items.entries()) {
      let visible

      children.push({
        className: UI.Text,
        properties: {
          text: item,
          event_object: this.event_object,
          clickAction: this.selectItem,
          height: this.rowHeight,
          width: this.width,
          color: this.color,
          backgroundColor: this.backgroundColor,
          selectable: true,
          display: 'block',
          visible: index < this.maxItems ? true : false
        }
      })
    }
    this.children = children
  }

  selectItem() {
    let target = this
    while(target.constructor.name != "List") {
      target = target.parent
    }
    target.selectedItem = this
  }
}
