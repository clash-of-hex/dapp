import { Container, Sprite } from 'pixi.js'
import { Manager } from '../Manager'
import { IScene } from './IScene'
import { Battlefield } from '../ui/Battlefield'

export class GameScene extends Container implements IScene {
  protected player: Sprite
  protected playerVelocity: number
  
  constructor() {
    super()
    this.playerVelocity = 2
    this.player = new Sprite()
  }
  
  public draw(): void {
    this.addChild(new Battlefield({
      position: { x: -50, y: -50 },
      hex: { dimensions: 50, origin: 'topLeft' },
      rectangle: {
        width: 50,
        height: 50,
      }, gep: 4,
    }))
    this.player = Sprite.from('logo')
    this.player.anchor.set(0.5)
    this.player.x = Manager.width / 2
    this.player.y = Manager.height / 2
    this.addChild(this.player)
  }
  
  public update(framesPassed: number): void {
    // Lets move player!
    this.player.x += this.playerVelocity * framesPassed
    
    if (this.player.x > Manager.width) {
      this.player.x = Manager.width
      this.playerVelocity = -this.playerVelocity
    }
    
    if (this.player.x < 0) {
      this.player.x = 0
      this.playerVelocity = -this.playerVelocity
    }
  }
  
  resize(screenWidth: number, screenHeight: number): void {
  }
}
