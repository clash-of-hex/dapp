import { Container } from 'pixi.js'
import { IPointData } from '@pixi/math'
import { ColorItem } from './ColorItem'
import { color, colorBy } from '../color'

export class ColorList extends Container {
  constructor(prop: IPointData) {
    super()
    this.x = prop.x
    this.y = prop.y
    
    const list: string[] = Object.keys(color)
    let y = this.y
    for (const name of list) {
      const item = new ColorItem({
        position: {
          x: 0, y,
        },
        label: name,
        color: colorBy(name),
        size: 19,
      })
      this.addChild(item)
      y += item.height + 5
    }
  }
}