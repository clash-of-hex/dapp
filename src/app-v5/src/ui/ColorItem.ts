import { Text, Graphics, Container } from 'pixi.js'
import { IPointData } from '@pixi/math'


export interface ColorListProp {
  position: IPointData
  color: number
  size: number
  label: string
  labelPadding?: number
}

export class ColorItem extends Container {
  private readonly label: Text
  private readonly color: Graphics
  
  constructor(prop: ColorListProp) {
    super()
    const radius = prop.size / 1.9
    prop.labelPadding = prop.labelPadding || 5
    
    this.x = prop.position.x
    this.y = prop.position.y
    
    this.color = new Graphics()
    this.color.lineStyle(0)
    this.color.beginFill(prop.color, 1)
    this.color.drawCircle(0, radius, radius)
    this.color.endFill()
    this.addChild(this.color)
    
    this.label = new Text(prop.label, {
      fontWeight: '300',
      fontStyle: 'normal',
      fontFamily: 'jetbrains-mono-all-300-normal',
      fontSize: prop.size,
      fill: 0x0,
    })
    this.label.x = radius + prop.labelPadding
    this.addChild(this.label)
  }
}