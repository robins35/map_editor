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

let init = (canvas) => {
  $(canvas).on('mousemove', (e) => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
    mouse.clicked = (e.which == 1 && !mouse.down)
    mouse.down = (e.which == 1)
    mouse.rightClicked = (e.which == 3 && !mouse.rightDown)
    mouse.rightDown = (e.which == 3)
    if(e.which == 1 && mouse.down && !mouse.clicked && mouse.dragging == false) {
      mouse.dragging = true
      mouse.dragStart = { x: mouse.x, y: mouse.y }
    }
  });

  $(canvas).on('mousedown', (e) => {
    if (e.which == 1) {
      mouse.clicked = !mouse.down
      mouse.down = true
    }
    else if (e.which == 3) {
      mouse.rightClicked = !mouse.rightDown
      mouse.rightDown = true
    }
  });

  $(canvas).on('mouseup', (e) => {
    if (e.which == 1) {
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
    mouse.dragStar =  null
  });

  $(document).on('keydown', (e) => {
    keysDown[e.keyCode] = true
  });

  $(document).on('keyup', (e) => {
    delete keysDown[e.keyCode]
  });
}

export { init, mouse, keysDown}
