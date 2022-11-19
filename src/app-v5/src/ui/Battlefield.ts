import { Graphics, Container, InteractionEvent } from 'pixi.js'
import { Hex, defineHex, Grid, rectangle, RectangleOptions, HexOptions } from 'honeycomb-grid'
import { Prop } from './Prop'
import { BattlefieldCell, BattlefieldCellEvent } from './BattlefieldCell'
import { random } from '../util'

export interface BattlefieldProp extends Prop {
  gep: number
  hex: Partial<HexOptions>
  rectangle: RectangleOptions
  actionCell?: (e: BattlefieldCellEvent) => void
}

export class Battlefield extends Container {
  private readonly grid: Grid<Hex>
  
  constructor(prop: BattlefieldProp) {
    super()
    if (prop.position) {
      this.x = prop.position.x
      this.y = prop.position.y
    }
    const hex = defineHex(prop.hex)
    this.grid = new Grid(hex, rectangle(prop.rectangle))
    const render = (hex: Hex) => {
      const cell = new BattlefieldCell({
        hex,
        gep: prop.gep,
        energy: random(5000, 500000),
      })
      if (prop.actionCell) {
        cell.addAction(prop.actionCell)
      }
      this.addChild(cell)
    }
    this.grid.forEach(render)
  }
}