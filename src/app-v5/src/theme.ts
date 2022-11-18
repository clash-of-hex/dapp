import { Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

Loader.registerPlugin(WebfontLoaderPlugin)

export interface Theme {
  colorDefault: number
  colorSecond: number
}

export async function themeLoad() {
  Loader.shared.add({
    name: 'jetbrains-mono-all-800-normal',
    url: 'jetbrains-mono-all-800-normal.woff',
  })
  Loader.shared.add({
    name: 'jetbrains-mono-all-300-normal',
    url: 'jetbrains-mono-all-300-normal.woff',
  })

  Loader.shared.load()
  return new Promise((resolve) => {
    Loader.shared.onComplete.once(resolve)
  })
}

export const theme: Theme = {
  colorDefault: 0xFFC700,
  colorSecond: 0x001D37,
}