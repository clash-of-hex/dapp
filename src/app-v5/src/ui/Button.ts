import { Text, Graphics, Container } from 'pixi.js'
import { theme } from '../theme'
import { ITextStyle } from '@pixi/text'
import { Prop } from './Prop'

export interface ButtonProp extends Prop {
  text?: string
  color?: number
  style?: Partial<ITextStyle>
}


export function buttonSecond(text: string) {
  return new Button({
    text,
    color: theme.colorSecond,
    style: {
      fill: 0xffffff,
    },
  })
}

export function buttonDefault(text: string) {
  return new Button({
    text,
    color: theme.colorDefault,
    style: {
      fill: 0x001D37,
    },
  })
}

// noinspection JSAnnotator
export class Button extends Container {
  private readonly button: Graphics
  private readonly text: Text
  
  constructor(prop: ButtonProp) {
    super()
    if (prop.x) {
      this.x = prop.x
    }
    if (prop.y) {
      this.y = prop.y
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