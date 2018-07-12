let mouse = {
  x: 0,
  y: 0,
  clicked: false,
  down: false,
  rightClicked: false,
  rightDown: false,
  dragging: false,
  dragStart: null
}

let keysDown = {}
let controlKeysDown = {}

let init = (canvas) => {
  $(canvas).on('mousemove', (e) => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
    console.log(`e.which: ${e.which} : e.buttons: ${e.buttons} : mouse.down: ${mouse.down} : mouse.clicked: ${mouse.clicked}`)


    // if(mouse.clicked)
    //   debugger
    if(e.which == 1 && mouse.clicked && mouse.dragging == false ) {//&& !mouse.clicked ) {
      console.log("Starting drag")
      mouse.dragging = true
      mouse.dragStart = { x: mouse.x, y: mouse.y }
    }

    mouse.rightClicked = false//(e.which == 3 && !mouse.rightDown)
    mouse.clicked = false//(!!(e.buttons & 1) || (e.buttons === undefined && e.which == 1)) && !mouse.down
  });

  $(canvas).on('mousedown', (e) => {
    if (e.which == 1) {
      console.log("mouse.down: true")

      mouse.clicked = !mouse.down
      mouse.down = true
    }
    else if (e.which == 3) {
      mouse.rightClicked = !mouse.rightDown
      mouse.rightDown = true
    }
  });

  $(canvas).on('mouseup', (e) => {
    // console.log("Mouseup")
    if (e.which == 1) {
      // console.log("leftmouse up")
      mouse.down = false
      mouse.clicked = false
      if (mouse.dragging) {
        mouse.dragging = false
        mouse.dragStart = null
        $(canvas).css({'cursor' : 'default'})
      }
    }
    else if (e.which == 3) {
      mouse.rightDown = false
      mouse.rightClicked = false
    }
  });

  $(canvas).on('contextmenu', (e) => {
    return false
  });

  $(canvas).on('mouseleave', (e) => {
    mouse.dragging = false
    mouse.dragStart =  null
  });

  $(document).on('keydown', (e) => {
    if(!$.isEmptyObject(controlKeysDown)) {
      controlKeysDown[e.keyCode] = true
      if(e.keyCode == 82) {
        if(e.preventDefault)
          e.preventDefault()
        else
          return false
      }
    }
    else
      keysDown[e.keyCode] = true

    if(e.keyCode == 17) {
      controlKeysDown = keysDown
      keysDown = {}
    }
  });

  $(document).on('keyup', (e) => {
    if(!$.isEmptyObject(controlKeysDown)) {
      delete controlKeysDown[e.keyCode]
      if(e.keyCode == 17) {
        keysDown = controlKeysDown
        controlKeysDown = {}
      }
    }
    else {
      delete keysDown[e.keyCode]
    }
  });
}

export default { init, mouse, keysDown, controlKeysDown }
