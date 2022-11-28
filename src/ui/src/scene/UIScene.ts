import { Container } from 'pixi.js'
import { IScene } from './IScene'
import { ColorList } from '../ui/ColorList'
import { buttonA, buttonB, buttonC, buttonD } from '../ui/Button'
import { buttonClaim, buttonAdd, buttonJoin } from '../ui/Badge'
import { Battlefield } from '../ui/Battlefield'

export class UIScene extends Container implements IScene {
  constructor() {
    super()
  }
  
  public draw(): void {
    const col1 = 50
    this.addChild(new ColorList({ x: col1, y: 10 }))
    
    const col2 = 240
    this.addChild(buttonA('Connect Wallet', { x: col2, y: 10 }))
    this.addChild(buttonB('Connect Wallet', { x: col2, y: 60 }))
    this.addChild(buttonC('Connect Wallet', { x: col2, y: 110 }))
    this.addChild(buttonD('Connect Wallet', { x: col2, y: 160 }))
    
    const col3 = 510
    this.addChild(buttonJoin({ x: col3, y: 10 }))
    this.addChild(buttonAdd({ x: col3, y: 40 }))
    this.addChild(buttonClaim({ x: col3, y: 70 }))
    
    const col4 = 610
    this.addChild(new Battlefield({
      position: { x: col4, y: 10 },
      rectangle: {
        width: 1,
        height: 1,
      },
    }))
  }
  
  public update(framesPassed: number): void {
  }
  
  resize(screenWidth: number, screenHeight: number): void {
  }
}
