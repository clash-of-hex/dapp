// Color styles
export interface Color {
  darkBlue: number,
  darkBlueSecond: number,
  darkOrange: number,
  midDarkblue: number,
  midNightBlue: number,
  richBlue: number,
  richYellow: number,
  blue: number,
  green: number,
  secondGreen: number,
  red: number,
  orange: number,
  lightYellow: number,
  lightBlue: number,
  lightRed: number,
  lightGreen: number,
  white: number,
}

export const color: Color = {
  darkBlue: 0x00040b,
  darkBlueSecond: 0x1a1e24,
  darkOrange: 0xc27400,
  midDarkblue: 0x001d37,
  midNightBlue: 0x0095a7,
  richBlue: 0x00e4ff,
  richYellow: 0xfbff3a,
  blue: 0x0047a3,
  green: 0x08de04,
  secondGreen: 0x00cc2d,
  red: 0xff0404,
  orange: 0xffc700,
  lightYellow: 0xfaff7e,
  lightBlue: 0x69e0ee,
  lightRed: 0xff2323,
  lightGreen: 0x4cff48,
  white: 0xffffff,
}

export function colorBy(name: string): number {
  if (color[name]) {
    return color[name]
  }
  return color.darkBlue
}