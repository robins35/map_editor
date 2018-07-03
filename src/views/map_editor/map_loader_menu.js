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
    this.mapData = []
    this.currentMap = properties["currentMap"]

    this.getMapsData()
  }

  list() {
    return this.children[1]
  }

  // Fetch preview information for all maps, so the user has some info on the
  // map before loading it.
  async getMapsData() {
    $.ajax({
      method: "GET",
      url: '/maps',
      error: (error) => {
        console.log(`ERROR: response text: ${error.responseText}, status: ${error.status}`)
      },
      success: ((data) => {
        this.mapData = data["map_data"]
        this.updateMapList()
      }).bind(this)
    });
  }

  updateMapList() {
    this.children[1].setListItems(this.mapData)
  }

  loadMap() {
    // de-serialize the map and load it into the map object here
    let selectedText = this.list().selectedItem
    let mapIdentifier = selectedText.data.unique_id
    let url = `/maps/${mapIdentifier}`

    $.ajax({
      method: "GET",
      url: url,
      error: (error) => {
        console.log(`ERROR: response text: ${error.responseText}, status: ${error.status}`)
      },
      success: ((data) => {
        // Instantiate map object and load into viewPort
        let grid = Game.environmentElements.fetchFirstOccurenceByName("Grid")
        let map = this.currentMap.loadNewFromLayout(data["layout"], mapIdentifier)

        // Update SideMenu and its child Minimap, accessing Sidemenu because it
        // was the UI element that launched this popup
        this.launcherMenu.map = map
        this.launcherMenu.changeMiniMapLink(map)
        grid.map = map

        this.exitPopup()
      }).bind(this)
    })
  }
}
