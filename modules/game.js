const States = ['loading', 'ready', 'paused', 'menu']
var canvas = undefined
var ctx = undefined


var state = 'loading'
var canvas
var ctx

var update = () => {
  //console.log("Updating");
}

var draw = () => {
  //console.log("Drawing");
}

var init = () => {
  canvas = document.getElementById("map_editor")
  ctx = canvas.getContext("2d")
}

export { state, canvas, ctx, update, draw, init }
