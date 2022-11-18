import { Application, Container, DisplayObject, Graphics } from 'pixi.js'
import { defineHex, Grid, rectangle, Hex } from 'honeycomb-grid'
import { GameConfig } from './GameConfig'
import { buttonDefault, buttonSecond } from './ui/Button'
import { themeLoad } from './theme'
import { badgeDefault, badgeSecond } from './ui/Badge'

export interface IScene extends DisplayObject {
  update(framesPassed: number): void;
  
  resize(screenWidth: number, screenHeight: number): void;
}

export class Game {
  private constructor() {
  }
  
  private static app: Application
  private static currentScene: IScene
  
  public static get width(): number {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  }
  
  public static get height(): number {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  }
  
  public static initialize(background: number): void {
    
    Game.app = new Application({
      resizeTo: window,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: background,
    })
    Game.app.ticker.add(Game.update)
    window.addEventListener('resize', Game.resize)
  }
  
  public static resize(): void {
    // if we have a scene, we let it know that a resize happened!
    if (Game.currentScene) {
      Game.currentScene.resize(Game.width, Game.height)
    }
  }
  
  public update(framesPassed: number): void {
    // Lets move clampy!
    this.clampy.x += this.clampyVelocity * framesPassed
    
    if (this.clampy.x > Manager.width) {
      this.clampy.x = Manager.width
      this.clampyVelocity = -this.clampyVelocity
    }
    
    if (this.clampy.x < 0) {
      this.clampy.x = 0
      this.clampyVelocity = -this.clampyVelocity
    }
  }
  
  static async setup(config: GameConfig) {
    Game.app = new Application({
      resolution: 2,//window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: config.backgroundColor,
      width: window.innerWidth,
      height: window.innerHeight,
    })
    await themeLoad()
    return Game.app
  }
  
  static init() {
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
    let offset = 50
    const btn1 = buttonDefault('Connect Wallet')
    btn1.x = 50
    btn1.y = offset
    Game.app.stage.addChild(btn1)
    offset += btn1.height + 10
    const btn2 = buttonSecond('ok foo bar')
    btn2.x = 50
    btn2.y = offset
    Game.app.stage.addChild(btn2)
    offset += btn2.height + 10
    
    const badge1 = badgeDefault('Join 👀')
    badge1.x = 50
    badge1.y = offset
    Game.app.stage.addChild(badge1)
    offset += badge1.height + 10
    
    const badge2 = badgeSecond('+Add')
    badge2.x = 50
    badge2.y = offset
    Game.app.stage.addChild(badge2)
    offset += badge2.height + 10
    
    const badge3 = badgeSecond(`
¯\\_( ͡❛ ͜ʖ ͡❛ )_/¯
    \\ . /
  `)
    badge3.x = 50
    badge3.y = offset
    Game.app.stage.addChild(badge3)
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
