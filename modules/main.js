import * as game from './game'

window.game = game

const FPS = 60

const AnimationFrame = window.requestAnimationFrame ||
                      window.webkitRequestAnimationFrame ||
                      window.mozRequestAnimationFrame ||
                      window.oRequestAnimationFrame ||
                      window.msRequestAnimationFrame ||
                      null;

$(document).ready( () => {
  game.init()

  if(AnimationFrame) {
    var updateLoop = () => {
      game.update()
      AnimationFrame(updateLoop)
    }
    var drawLoop = () => {
      game.draw()
      AnimationFrame(drawLoop)
    }

    updateLoop()
    drawLoop()
  }
  else {
    console.log("Falling back to setInterval, update your browser!")
    setInterval(game.update, 1000/FPS)
    setInterval(game.draw, 1000/FPS)
  }
})

