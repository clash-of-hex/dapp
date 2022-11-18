// This could have a lot more generic functions that you force all your scenes to have
// Update is just an example. Also, this could be in its own file...
import { DisplayObject } from '@pixi/display'

export interface IScene extends DisplayObject {
  update(framesPassed: number): void;
  
  draw(): void;
  
  // we added the resize method to the interface
  resize(screenWidth: number, screenHeight: number): void;
}
