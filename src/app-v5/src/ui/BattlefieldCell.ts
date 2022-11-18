import { Graphics, Container, InteractionEvent } from 'pixi.js'
import { Hex } from 'honeycomb-grid'

export interface BattlefieldCellProp {
  hex: Hex
  gep?: number
}

export class BattlefieldCell extends Container {
  private readonly cell: Graphics
  
  constructor(prop: BattlefieldCellProp) {
    super()
    prop.gep = prop.gep ? prop.gep : 0
    this.cell = new Graphics()
    this.cell.name = `${ prop.hex.col }x${ prop.hex.row }`
    const gepX = prop.hex.col * prop.gep + (prop.hex.row % 2 == 0 ? 0 : prop.gep / 2)
    const gepY = prop.hex.row * prop.gep
    this.cell.beginFill(0x001d37)
    this.cell.lineStyle(2, 0x0f93aa, 1)
    const [ first, ...other ] = prop.hex.corners
    this.cell.moveTo(first.x + gepX, first.y + gepY)
    other.forEach(({ x, y }) => this.cell.lineTo(x + gepX, y + gepY))
    this.cell.lineTo(first.x + gepX, first.y + gepY)
    this.cell.closePath()
    this.cell.endFill()
    this.cell.interactive = true
    this.cell.cursor = 'pointer'
    this.addChild(this.cell)
  }
  
  addAction(fn: (e: InteractionEvent) => void) {
    this.cell.on('pointerdown', fn)
  }
}
