import UIElement from './ui_element'

export default class PopupMenu extends UIElement {
  constructor(canvas, properties) {
    defaultProperties = {
      backgroundColor: '#dbcdae',
      width: canvas.width / 2,
      height: canvas.height * 0.66,
      alignment: "center",
      verticalAlignment: "middle"
    }

    super(canvas, Object.assign(defaultProperties, properties))
    this.name = "UI.PopupMenu"
    this.createChildElements(properties)
  }

  createChildElements(properties) {
    this.children = []
    let lastChild = null
    if(properties["children"]) {
      for(let childData of properties["children"]) {
        let childClassName = childData["className"]
        let childProperties = childData["properties"]
        childProperties["parent"] = this
        childProperties["previousSibling"] = lastChild
        let child = new childClassName(this.canvas, childProperties)
        this.children.push(child)
        lastChild = child
      }
    }
  }
}
