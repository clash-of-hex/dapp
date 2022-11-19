import { IPointData } from '@pixi/math'

export function log(message: string) {
  console.log(message)
}

export function random(min, max): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function pointyHexCorner(center: IPointData, size: number, i: number): IPointData {
  const angle = 60 * i - 30
  const rad = Math.PI / 180 * angle
  return {
    x: center.x + size * Math.cos(rad),
    y: center.y + size * Math.sin(rad),
  }
}

export function pointyHexCornerList(size: number): IPointData[] {
  const result = Array<IPointData>()
  for (let i = 0; i < 6; i++) {
    result.push(pointyHexCorner({ x: size / 2, y: size / 2 }, size, i))
  }
  return result
}
