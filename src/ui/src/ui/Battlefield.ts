import { Graphics, Container } from 'pixi.js'
import { Hex, defineHex, Grid, rectangle, RectangleOptions, HexOptions, Orientation } from 'honeycomb-grid'
import { Prop } from './Prop'
import { BattlefieldCell } from './BattlefieldCell'

export interface BattlefieldProp extends Prop {
  gep?: number
  hex?: Partial<HexOptions>
  rectangle: RectangleOptions
}

export class Battlefield extends Container {
  private readonly grid: Grid<Hex>
  
  constructor(prop: BattlefieldProp) {
    super()
    if (prop.position) {
      this.x = prop.position.x
      this.y = prop.position.y
    }

    const hex = defineHex({
      orientation: Orientation.FLAT,
      dimensions: 90,
      origin: 'topLeft',
      ...prop.hex
    })
    this.grid = new Grid(hex, rectangle(prop.rectangle))
    const render = (hex: Hex) => {
      const cell = new BattlefieldCell({
        hex,
        gep: prop.gep,
      })
      cell.addAction((e) => {
        const el = e.target as Graphics
        el.destroy()
        console.log(e)
      })
      this.addChild(cell)
    }
    this.grid.forEach(render)
  }
}