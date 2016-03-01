let mouse = {
  x: 0,
  y: 0,
  clicked: false,
  down: false
}

let keysDown = {}

let init = (canvas) => {
  $(canvas).on('mousemove', (e) => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
    mouse.clicked = (e.which == 1 && !mouse.down)
    mouse.down = (e.which == 1)
  });

  $(canvas).on('mousedown', (e) => {
    mouse.clicked = !mouse.down
    mouse.down = true
  });

  $(canvas).on('mouseup', (e) => {
    mouse.down = false
    mouse.clicked = false
  });

  $(document).on('keydown', (e) => {
    keysDown[e.keyCode] = true
  });

  $(document).on('keyup', (e) => {
    delete keysDown[e.keyCode]
  });
}

export { init, mouse, keysDown}
