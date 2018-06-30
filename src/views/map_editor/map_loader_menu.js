import { UI } from '../../ui/ui'

export default class MapLoaderMenu extends UI.PopupMenu {
  constructor(properties = {}) {
    properties["event_object"] = Game.events
    properties["referenceHash"] = Game.uiElements
    properties["disableFocusHashes"] = [Game.environmentElements, Game.sprites]
    properties["headerText"] = "Load Map"
    properties["width"] = "40%"
    properties["verticalAlignment"] = "top"
    properties["marginTop"] = "10%"
    properties["actionButtonText"] = "Load Map"
    properties["actionButtonMethod"] = () => { this.loadMap() }

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
      }
    ]

    super(Game.canvas, properties)

    // Bind methods to this object so 'this' is the MapLoaderMenu
    this.getMapsData = this.getMapsData.bind(this)


    this.name = "UI.MapLoaderMenu"
    this.page = 1
    this.mapNames = []

    this.getMapsData()
  }

  async getMapsData() {
    $.ajax({
      method: "GET",
      url: '/maps',
      error: (error) => {
        console.log(`ERROR: response text: ${error.responseText}, status: ${error.status}`)
      },
      success: ((data) => {
        // Going to have to work/modify this data either server side or client side
        this.mapNames = data["map_names"]
        this.updateMapList()
      }).bind(this)
    });
  }

  updateMapList() {
    this.children[1].setListItems(this.mapNames)
  }

  loadMap() {
    // de-serialize the map and load it into the map object here
  }
}
