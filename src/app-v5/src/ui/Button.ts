import { Text, Graphics, Container } from 'pixi.js'
import { ITextStyle } from '@pixi/text'
import { IPointData } from '@pixi/math'
import { color } from '../color'
import { Prop } from './Prop'

export interface ButtonProp extends Prop {
  text?: string
  color?: number
  style?: Partial<ITextStyle>
}


export function buttonA(text: string, position?: IPointData) {
  return new Button({
    position,
    text,
    color: color.orange,
    style: {
      fill: color.darkBlue,
    },
  })
}

export function buttonB(text: string, position?: IPointData) {
  return new Button({
    position,
    text,
    color: 0x001D37,
    style: {
      fill: color.white,
    },
  })
}

export function buttonC(text: string, position?: IPointData) {
  return new Button({
    position,
    text,
    color: 0x204472,
    style: {
      fill: color.white,
    },
  })
}

export function buttonD(text: string, position?: IPointData) {
  return new Button({
    position,
    text,
    color: 0xa08420,
    style: {
      fill: 0x202f3c,
    },
  })
}

// noinspection JSAnnotator
export class Button extends Container {
  private readonly button: Graphics
  private readonly text: Text
  
  constructor(prop: ButtonProp) {
    super()
    if (prop.position) {
      this.x = prop.position.x
      this.y = prop.position.y
    }
    this.text = new Text(prop.text || '', {
      fontWeight: '800',
      fontStyle: 'normal',
      fontFamily: 'jetbrains-mono-all-800-normal',
      fontSize: 24,
      ...prop.style,
    })
    this.text.x = 20
    this.text.y = 10
    this.button = new Graphics()
    this.button.beginFill(prop.color || 0xffffff)
    this.button.drawRoundedRect(
      0, 0,
      this.text.width + 40,
      this.text.height + 20,
      10,
    )
    this.button.endFill()
    // this.interactive = true
    // this.cursor = 'pointer'
    this.addChild(this.button)
    this.addChild(this.text)
  }
}