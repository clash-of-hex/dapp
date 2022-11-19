import { Graphics, Container, InteractionEvent, Text } from 'pixi.js'
import { Hex } from 'honeycomb-grid'
import { color } from '../color'
import { pointyHexCornerList } from '../util'

export interface BattlefieldCellProp {
  hex: Hex
  gep?: number
  energy?: number
}

export class BattlefieldCellEvent {
  readonly event: InteractionEvent
  readonly cell: BattlefieldCell
  
  constructor(event: InteractionEvent, cell: BattlefieldCell) {
    this.event = event
    this.cell = cell
  }
}

export class BattlefieldCell extends Container {
  private readonly cell: Graphics
  
  constructor(prop: BattlefieldCellProp) {
    super()
    prop.gep = prop.gep ? prop.gep : 0
    this.cell = new Graphics()
    this.cell.name = `${ prop.hex.col }x${ prop.hex.row }`
    const gepX = 0//prop.hex.col * prop.gep + (prop.hex.row % 2 == 0 ? 0 : prop.gep / 2)
    const gepY = 0//prop.hex.row * prop.gep
    //const [ first, ...other ] = pointyHexCornerList(prop.hex.dimensions.xRadius) //prop.hex.corners
    const [ first, ...other ] = prop.hex.corners
    // this.x = prop.hex.center.x
    // this.y = prop.hex.center.y
    
    this.cell.beginFill(0x001d37)
    this.cell.lineStyle(2, 0x0f93aa, 1)
    this.cell.moveTo(first.x + gepX, first.y + gepY)
    other.forEach(({ x, y }) => this.cell.lineTo(x + gepX, y + gepY))
    this.cell.lineTo(first.x + gepX, first.y + gepY)
    this.cell.closePath()
    this.cell.endFill()
    
    const label = new Text(prop.energy || '0', {
      fontWeight: '800',
      fontStyle: 'normal',
      fontFamily: 'jetbrains-mono-all-800-normal',
      fontSize: Math.floor(prop.hex.height * 0.21),
      fill: color.orange,
    })
    label.x = 0
    label.y = 0
    this.cell.addChild(label)
    this.addChild(this.cell)
    // prop.gep = prop.gep ? prop.gep : 0
    // this.name = `${ prop.hex.col }x${ prop.hex.row }`
    //
    // this.x = prop.hex.width * 2 * prop.hex.row
    // this.y = prop.hex.height * 2 * prop.hex.col
    //
    // const gepX = prop.hex.col * prop.gep + (prop.hex.row % 2 == 0 ? 0 : prop.gep / 2)
    // const gepY = prop.hex.row * prop.gep
    // const [ first, ...other ] = prop.hex.corners
    //
    // this.cell = new Graphics()
    // this.cell.beginFill(0x001d37)
    // this.cell.lineStyle(2, 0x0f93aa, 1)
    // this.cell.moveTo(prop.hex.center.x, prop.hex.center.y)
    // this.cell.lineTo(prop.hex.center.x + 10, prop.hex.center.y + 10)
    // this.cell.closePath()
    // this.cell.endFill()
    // const label = new Text(prop.energy || '0', {
    //   fontWeight: '800',
    //   fontStyle: 'normal',
    //   fontFamily: 'jetbrains-mono-all-800-normal',
    //   fontSize: Math.floor(prop.hex.height * 0.21),
    //   fill: color.orange,
    // })
    // // this.label.x = first.x + gepX // + (this.cell.width - this.label.width) / 2
    // // this.label.y = first.y + gepY //+ (this.cell.height - this.label.height) / 5
    // this.cell.addChild(label)
    // // this.cell = new Graphics()
    // // this.cell.beginFill(0x001d37)
    // // this.cell.lineStyle(2, 0x0f93aa, 1)
    // // this.cell.moveTo(first.x + gepX, first.y + gepY)
    // // other.forEach(({ x, y }) => this.cell.lineTo(x + gepX, y + gepY))
    // // this.cell.lineTo(first.x + gepX, first.y + gepY)
    // // this.cell.closePath()
    // //
    // // this.cell.endFill()
    // this.addChild(this.cell)
  }
  
  addAction(fn: (e: BattlefieldCellEvent) => void) {
    this.cell.interactive = true
    this.cell.cursor = 'pointer'
    this.cell.on('pointerdown', (e: InteractionEvent) => {
      fn(new BattlefieldCellEvent(e, this))
    })
  }
}
