import { Application } from '@pixi/app'
import { IScene } from './scene/IScene'
import { LoaderScene } from './scene/LoaderScene'

export class Manager {
  private constructor() { /* this class is purely static. No constructor to see here */
  }
  
  // Safely store variables for our game
  private static app: Application
  private static runAssetLoader = false
  private static currentScene: IScene
  
  public static get width(): number {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  }
  
  public static get height(): number {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  }
  
  // Use this function ONCE to start the entire machinery
  public static initialize(width: number, height: number, background: number): void {
    // Create our pixi app
    const devicePixelRatio = window.devicePixelRatio || 1
    Manager.app = new Application({
      view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
      resizeTo: window, // This line here handles the actual resize!
      resolution: devicePixelRatio,
      autoDensity: true,
      backgroundColor: background,
    })
    
    // Add the ticker
    Manager.app.ticker.add(Manager.update)
    
    // listen for the browser telling us that the screen size changed
    window.addEventListener('resize', Manager.resize)
  }
  
  public static resize(): void {
    // if we have a scene, we let it know that a resize happened!
    if (Manager.currentScene) {
      Manager.currentScene.resize(Manager.width, Manager.height)
    }
  }
  
  private static get instance() {
    if (typeof Manager.app == 'undefined') {
      throw new Error('Manager need initialize')
    }
    return Manager.app
  }
  
  static get view() {
    return Manager.instance.view as HTMLCanvasElement
  }
  
  // Call this function when you want to go to a new scene
  public static changeScene(scene: IScene): void {
    if (this.runAssetLoader) {
      this.drawScene(scene)
    } else {
      this.drawScene(new LoaderScene(scene))
      this.runAssetLoader = true
    }
  }
  
  public static drawScene(scene: IScene): void {
    // Remove and destroy old scene... if we had one..
    if (Manager.currentScene) {
      Manager.app.stage.removeChild(Manager.currentScene)
      Manager.currentScene.destroy()
    }
    // Add the new one
    scene.draw()
    Manager.currentScene = scene
    Manager.app.stage.addChild(Manager.currentScene)
  }
  
  // This update will be called by a pixi ticker and tell the scene that a tick happened
  private static update(framesPassed: number): void {
    // Let the current scene know that we updated it...
    // Just for funnies, sanity check that it exists first.
    if (Manager.currentScene) {
      Manager.currentScene.update(framesPassed)
    }
    
    // as I said before, I HATE the "frame passed" approach
    // I would rather use `Manager.app.ticker.deltaMS`
  }
}
