import * as game from 'game'

window.Game = game

const FPS = 60

const AnimationFrame = window.requestAnimationFrame ||
                      window.webkitRequestAnimationFrame ||
                      window.mozRequestAnimationFrame ||
                      window.oRequestAnimationFrame ||
                      window.msRequestAnimationFrame ||
                      null;

$(document).ready( () => {
  Game.init()

  if(AnimationFrame) {
    let updateLoop = () => {
      Game.update()
      AnimationFrame(updateLoop)
    }
    let drawLoop = () => {
      Game.draw()
      AnimationFrame(drawLoop)
    }

    updateLoop()
    drawLoop()
  }
  else {
    setInterval(Game.update, 1000/FPS)
    setInterval(Game.draw, 1000/FPS)
  }
})

