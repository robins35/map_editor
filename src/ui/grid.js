import UIElement from './ui_element'

export default class Grid extends UIElement {
  constructor (canvas, properties, skipChildCreation = false) {
    super(canvas, properties, skipChildCreation)
    this.name = "UI.Grid"
  }

  buildColumns(properties) {
    const height = UIElement.pixelDimension(properties["height"],
        (properties["parent"] || this.canvas).height)

    const width = UIElement.pixelDimension(properties["width"],
        (properties["parent"] || this.canvas).width)

    this.rowHeight = properties["rowHeight"] || parseInt(height / properties["rows"].length)
    this.columnWidth = parseInt(width / properties["rows"][0].length)
    this.rowMargin = properties["rowMargin"] || 0
    this.columnMargin = properties["columnMargin"] || 0

    properties["children"] = []

    for(let row of properties["rows"]) {
      let columnIndex = 0
      for(let column of row) {
        if(columnIndex < (row.length - 1)) {
          column['properties']['display'] = 'inline'
        }
        column['properties']['height'] = this.rowHeight
        column['properties']['width'] = this.columnWidth
        column['properties']['topMargin'] = this.rowMargin
        column['properties']['bottomMargin'] = this.rowMargin
        column['properties']['margin'] = this.columnMargin
        properties['children'].push(column)
        columnIndex++
      }
    }
  }

  createChildElements(properties) {
    this.buildColumns(properties)
    super.createChildElements(properties)
  }

}
