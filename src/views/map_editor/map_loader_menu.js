import { UI } from '../../ui/ui'

export default class MapLoaderMenu extends UI.PopupMenu {
  constructor(properties) {
    super(Game.canvas, properties, true)

    // Bind methods to this object so this is the MapLoaderMenu
    this.exitMapLoaderMenu = this.exitMapLoaderMenu.bind(this)

    properties["children"] = [
      {
        className: UI.List,
        properties: {
          event_object: Game.events,
          height: "70%",
          width: "60%",
          alignment: "center",
          verticalAlignment: "top",
          items: []
        }
      },
      {
        className: UI.Button,
        properties: {
          text: "Cancel",
          margin: 10,
          alignment: "left",
          verticalAlignment: "bottom",
          display: "inline",
          event_object: Game.events,
          clickAction: this.exitMapLoaderMenu
        }
      },
      {
        className: UI.Button,
        properties: {
          text: "Load Map",
          margin: 10,
          alignment: "right",
          verticalAlignment: "bottom",
          display: "inline",
          event_object: Game.events,
          clickAction: MapLoaderMenu.loadMap
        }
      }
    ]

    super.createChildElements(properties)
    this.name = "UI.MapLoaderMenu"
    this.page = 1
    this.mapData = []

    Game.uiElements.push(this)
  }

  getMapsData() {
    $.ajax({
      method: "GET",
      url: '/maps',
      data: { layout: JSON.stringify(this.layout)},
      error: (error) => {
        console.log(`ERROR: response text: ${error.responseText}, status: ${error.status}`)
      },
      success: ((data) => {
        // Going to have to work/modify this data either server side or client side
        mapsUIPreviewData = data
        this.mapData = mapsUIPreviewData
        this.updateMapList()
      }).bind(this)
    });
  }

  updateMapList() {
    this.children[1].items = this.mapData
  }

  static loadMap() {
    // de-serialize the map and load it into the map object here
  }

  exitMapLoaderMenu() {
    Game.uiElements.remove(this)
  }
}
