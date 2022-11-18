import { Text, Graphics, Container } from 'pixi.js'
import { ButtonProp } from './Button'

export interface BadgeProp extends ButtonProp {}


export function badgeSecond(text: string) {
  return new Badge({
    text,
    color: 0x08DE04,
    style: {
      fill: 0x08DE04,
    },
  })
}

export function badgeDefault(text: string) {
  return new Badge({
    text,
    color: 0x00E4FF,
    style: {
      fill: 0x00E4FF,
    },
  })
}

// noinspection JSAnnotator
export class Badge extends Container {
  private readonly button: Graphics
  private readonly text: Text
  
  constructor(prop: BadgeProp) {
    super()
    if (prop.x) {
      this.x = prop.x
    }
    if (prop.y) {
      this.y = prop.y
    }
    this.text = new Text(prop.text || '', {
      fontWeight: '300',
      fontStyle: 'normal',
      fontFamily: 'jetbrains-mono-all-300-normal',
      fontSize: 16,
      leading: 16,
      ...prop.style,
    })
    this.text.x = 5
    this.text.y = 0
    this.button = new Graphics()
  
    this.button.lineStyle(2, prop.color || 0x00E4FF, 1);
    this.button.beginFill(0x650A5A, 0.25);
    this.button.drawRoundedRect(0, 0, this.text.width + 10, this.text.height, 4);
    this.button.endFill();

    this.interactive = true
    this.cursor = 'pointer'
    this.addChild(this.button)
    this.addChild(this.text)
  }
}