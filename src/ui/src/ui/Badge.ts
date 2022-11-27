import { Text, Graphics, Container } from 'pixi.js'
import { IPointData } from '@pixi/math'
import { ITextStyle } from '@pixi/text'
import { ButtonProp } from './Button'

export function buttonAdd(position?: IPointData) {
  return new Badge({
    position,
    text: '+Add',
    color: 0x08DE04,
  })
}

export function buttonJoin(position?: IPointData) {
  return new Badge({
    position,
    text: 'Join',
    color: 0x00E4FF,
  })
}

export function buttonClaim(position?: IPointData) {
  return new Badge({
    position,
    text: 'Claim',
    color: 0xfbff3a,
  })
}

// noinspection JSAnnotator
export class Badge extends Container {
  private readonly button: Graphics
  private readonly text: Text
  
  constructor(prop: ButtonProp) {
    super()
    if (prop.position) {
      this.x = prop.position.x
      this.y = prop.position.y
    }
    
    const textStyle: Partial<ITextStyle> = {
      fontWeight: '300',
      fontStyle: 'normal',
      fontFamily: 'jetbrains-mono-all-300-normal',
      fontSize: 16,
      leading: 16,
      ...prop.style,
    }
    textStyle.fill = textStyle.fill ? textStyle.fill : prop.color
    this.text = new Text(prop.text || '', textStyle)
    this.text.x = 6
    this.text.y = 2
    
    this.button = new Graphics()
    this.button.lineStyle(2, prop.color || 0x00E4FF, 1)
    this.button.beginFill(0x650A5A, 0.25)
    this.button.drawRoundedRect(
      0, 0,
      this.text.width + this.text.x * 2,
      this.text.height + this.text.y * 2,
      4,
    )
    this.button.endFill()
    
    this.interactive = true
    this.cursor = 'pointer'
    this.addChild(this.button)
    this.addChild(this.text)
  }
}