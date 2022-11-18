import { Container, Graphics, Loader } from 'pixi.js'
import { WebfontLoaderPlugin } from 'pixi-webfont-loader'

Loader.registerPlugin(WebfontLoaderPlugin)
import { asset } from '../asset'
import { Manager } from '../Manager'
import { IScene } from './IScene'

export class LoaderScene extends Container implements IScene {
  
  // for making our loader graphics...
  private loaderBar: Container
  private loaderBarBoder: Graphics
  private loaderBarFill: Graphics
  private scene: IScene
  
  constructor(scene: IScene) {
    super()
    this.scene = scene
    const loaderBarWidth = Manager.width * 0.8
  
    this.loaderBarFill = new Graphics()
    this.loaderBarFill.beginFill(0x008800, 1)
    this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50)
    this.loaderBarFill.endFill()
    this.loaderBarFill.scale.x = 0
  
    this.loaderBarBoder = new Graphics()
    this.loaderBarBoder.lineStyle(10, 0x0, 1)
    this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50)
  
    this.loaderBar = new Container()
    this.loaderBar.addChild(this.loaderBarFill)
    this.loaderBar.addChild(this.loaderBarBoder)
    this.loaderBar.position.x = (Manager.width - this.loaderBar.width) / 2
    this.loaderBar.position.y = (Manager.height - this.loaderBar.height) / 2
    this.addChild(this.loaderBar)
  }
  
  public draw(): void {
    Loader.shared.add(asset)
    Loader.shared.onProgress.add(this.progress, this)
    Loader.shared.onComplete.once(this.loaded, this)
    Loader.shared.load()
  }
  
  private progress(loader: Loader): void {
    this.loaderBarFill.scale.x = loader.progress / 100
  }
  
  private loaded(): void {
    Manager.changeScene(this.scene)
  }
  
  public update(framesPassed: number): void {
    // To be a scene we must have the update method even if we don't use it.
  }
  
  resize(screenWidth: number, screenHeight: number): void {
  }
}
