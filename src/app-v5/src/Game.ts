import { Application, Container, Graphics, InteractionEvent } from 'pixi.js'
import { defineHex, Grid, rectangle, Hex } from 'honeycomb-grid'
import { GameConfig } from './GameConfig'

export class Game {
  private static app: Application
  
  static setup(config: GameConfig) {
    Game.app = new Application({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: config.backgroundColor,
      width: window.innerWidth,
      height: window.innerHeight,
    })
    
    const Hex = defineHex({ dimensions: 50, origin: 'topLeft' })
    const grid = new Grid(Hex, rectangle({
      width: 15,
      height: 15,
    }))
    const div: Container = new Container()
    const gep = 4
    const renderCanvas = (hex: Hex) => {
      const graphics = new Graphics()
      graphics.name = `${ hex.col }x${ hex.row }`
      const gepX = hex.col * gep + (hex.row % 2 == 0 ? 0 : gep / 2)
      const gepY = hex.row * gep
      graphics.beginFill(0x001d37)
      graphics.lineStyle(2, 0x0f93aa, 1)
      const [ firstCorner, ...otherCorners ] = hex.corners
      graphics.moveTo(firstCorner.x + gepX, firstCorner.y + gepY)
      otherCorners.forEach(({ x, y }) => graphics.lineTo(x + gepX, y + gepY))
      graphics.lineTo(firstCorner.x + gepX, firstCorner.y + gepY)
      
      graphics.closePath()
      graphics.endFill()
      graphics.interactive = true
      graphics.cursor = 'pointer'
      
      graphics.on('pointerdown', (e: InteractionEvent) => {
        const el = e.target as Graphics
        el.destroy()
        console.log(e.target)
      })
      div.addChild(graphics)
    }
    grid.forEach(renderCanvas)
    div.x = window.innerWidth / 2 - div.height / 2
    div.y = window.innerHeight / 2 - div.width / 2
    const zoom = 1
    div.scale = { x: zoom, y: zoom }
    Game.app.stage.addChild(div)
  }
  
  private static get instance() {
    if (typeof Game.app == 'undefined') {
      throw new Error('Game need setup')
    }
    return Game.app
  }
  
  static get view() {
    return Game.instance.view as HTMLCanvasElement
  }
}
