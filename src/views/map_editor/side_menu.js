import { UI } from '../../ui/ui'
import MiniMap from '../../mini_map'
import MapLoaderMenu from './map_loader_menu'

export default class SideMenu extends UI.UIElement {
  constructor(map, viewPort) {
    let properties = {
      backgroundColor: '#dbcdae',
      width: Game.canvas.width - viewPort.width,
      height: viewPort.height,
      alignment: "left",
      verticalAlignment: "top",
      children: [
        {
          className: MiniMap,
          properties: {
            map: map,
            viewPort: viewPort
          }
        },
        {
          className: UI.Grid,
          properties: {
            height: "40%",
            width: "80%",
            rowHeight: 30,
            rowMargin: 10,
            alignment: "center",
            verticalAlignment: "top",
            rows: [
              [
                {
                  className: UI.Button,
                  properties: {text: "Load Map", event_object: Game.events, clickAction: SideMenu.loadMapLoaderMenu}
                }
              ],
              [
                {
                  className: UI.Button,
                  properties: {text: "Save Map", event_object: Game.events, clickAction: SideMenu.saveMap}
                }
              ],
              [
                {
                  className: UI.Button,
                  properties: {text: "Main Menu", event_object: Game.events, clickAction: SideMenu.loadMainMenu}
                }
              ],
            ]
          }
        }
      ]
    }

    super(Game.canvas, properties)
    this.name = "UI.SideMenu"
    this.map = map
  }

  static saveMap() {
    // Loop up parent chain until you get to the SideMenu (which has the map)
    let target = this
    while(target.map === undefined) {
      target = target.parent
    }
    target.map.save()
  }

  static loadMainMenu() {
    Game.setState("load_main_menu")
  }

  static loadMapLoaderMenu() {
    // second param needs to be the properties
    let mapLoaderMenu = new MapLoaderMenu({
      headerText: "Load Map",
      event_object: Game.events,
      referenceHash: Game.uiElements.list,
      width: "40%"
    })
  }

}
