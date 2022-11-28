import { Graphics, Container, InteractionEvent } from 'pixi.js'
import { Hex } from 'honeycomb-grid'

const lineStyleWidth = 6
export interface BattlefieldCellProp {
  hex: Hex
  gep?: number
}

export class BattlefieldCell extends Container {
  private readonly cell: Graphics
  
  constructor(prop: BattlefieldCellProp) {
    super()
    prop.gep = prop.gep || lineStyleWidth * 2
    this.cell = new Graphics()
    this.cell.name = `${ prop.hex.col }x${ prop.hex.row }`
    const gepX = prop.hex.col * prop.gep
    const gepY = prop.hex.row * prop.gep + (prop.hex.col % 2 == 0 ? 0 : prop.gep / 2)
    this.cell.beginFill(0x001d37)
    this.cell.lineStyle(lineStyleWidth, 0x0f93aa, 1)
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
