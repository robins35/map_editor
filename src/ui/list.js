import UIElement from './ui_element'
import Text from './text'

const DEFAULT_ROW_HEIGHT = 20
const DEFAULT_FONT_SIZE = 20
const DEFAULT_PADDING = 6

export default class List extends UIElement {
  constructor(canvas, properties, skipChildCreation = false) {
    properties["display"] = properties["display"] || "block"
    properties["backgroundColor"] = "#333333"
    properties["color"] = "#00ff00"
    properties["borderWidth"] = 1
    super(canvas, properties, skipChildCreation)
    this.name = "UI.List"
    this.currentStartingIndex = 0
    this.currentViewSlice = this.children.slice(0, this.maxItems)

    // if(this.items != undefined && this.items.length > 0) {
    //   super.createChildElements(this)
    // }
  }

  createChildElements(properties) {
    this.items = properties["items"]
    this.event_object = properties["event_object"]
    this.font = properties["font"] || "glass_tty_vt220medium"
    this.fontSize = properties["fontSize"] || DEFAULT_FONT_SIZE
    this.padding = properties["padding"] || DEFAULT_PADDING
    // this.textSize = Game.ctx.font = font

    // 4 seems to be the number needed for this estimation
    this.rowHeight = properties["rowHeight"] || (this.fontSize + 4 + (2*this.padding))
    this.maxItems = Math.floor(this.height / this.rowHeight)

    this.convertItemsToUIFormat()
    if(this.items != undefined && this.items.length > 0) {
      super.createChildElements({ children: this.children })
    }
  }

  convertItemsToUIFormat() {
    let children = []

    for(let [index, item] of this.items.entries()) {
      children.push({
        className: Text,
        properties: {
          text: item,
          event_object: this.event_object,
          clickAction: this.selectItem,
          height: this.rowHeight,
          width: this.width,
          textBaseline: "middle",
          fontSize: this.fontSize,
          font: this.font,
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

  setListItems(items) {
    this.items = items
    this.convertItemsToUIFormat()
    if(this.items != undefined && this.items.length > 0) {
      super.createChildElements({ children: this.children })
      this.currentStartingIndex = 0
      this.currentViewSlice = this.children.slice(0, this.maxItems)
    }
  }

  selectItem() {
    let target = this
    while(target.constructor.name != "List") {
      target = target.parent
    }
    target.selectedItem = this
  }

  update() {
    this.handleArrowkeyScrolling()
    super.update()
  }

  setSelectedItem(item) {
    this.selectedItem = item
    Text.selectedText = item.id
  }

  handleArrowkeyScrolling() {
    if(this.event_object.keysDown[38]) {
      if (this.selectedItem && this.selectedItem.previousSibling) {
        if(this.selectedItem.id == this.currentViewSlice[0].id)
          this.shiftListView(-1)

        this.setSelectedItem(this.selectedItem.previousSibling)
      }
      else {
        this.setSelectedItem(this.children[0])
      }

      delete this.event_object.keysDown[38]
    }

    if(this.event_object.keysDown[40]) {
      if(this.selectedItem) {
        if (this.selectedItem.nextSibling) {
          if(this.selectedItem.id == this.currentViewSlice.slice(-1)[0].id)
            this.shiftListView(1)

          this.setSelectedItem(this.selectedItem.nextSibling)
        }
      }
      else {
        this.setSelectedItem(this.children[0])
      }

      delete this.event_object.keysDown[40]
    }
  }

  shiftListView(i) {
    let newStartingIndex = this.currentStartingIndex + i
    let newEndingBound = newStartingIndex + this.maxItems

    if(newStartingIndex < 0 || newEndingBound > this.children.length)
      return

    let newSlice = this.children.slice(newStartingIndex, newEndingBound)

    // Resetting visibility the lazy way here. I could only turn off visibility
    // for the effected items, but the list will never be very large so it
    // shouldn't have an effect on performance.
    for(let item of this.currentViewSlice) {
      item.visible = false
    }

    for(let [index, item] of newSlice.entries()) {
      item.pos.y = this.pos.y + (index * this.rowHeight)
      item.visible = true
    }

    this.currentStartingIndex = newStartingIndex
    this.currentViewSlice = newSlice
  }
}
