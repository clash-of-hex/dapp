import { Graphics } from '@pixi/graphics'
import { createPlayer } from '../system/player'
import { Engine } from '../system/Engine'
import { Scene } from '../system/Scene'
// import {TextStyle, Text} from "pixi.js"
// import {Button} from "../ui/Button"
// import * as PIXI from "pixi.js";
import { Button } from "pixi-yoo-ai";

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;
function SceneLoad(name: string) {
    const engine = Engine.instance
    console.log('SceneLoad', name, engine.screen)

    const graphics = new Graphics();
    // Rectangle
    graphics.beginFill(0xDE3249);
    graphics.drawRect(50, 50, 100, 100);
    graphics.endFill();
    engine.add(graphics)

    // const style: TextStyle = new TextStyle({
    //     align: "center",
    //     fill: "#0000ff",
    //     fontSize: 30
    // })
    // const texty: Text = new Text('私に気づいて先輩！', style)
    // texty.text = "This is expensive to change, please do not abuse"
    // texty.x = 500//engine.screen.height / 2
    // texty.y = 500//engine.screen.width / 2
    // Engine.addText(texty)
    // const btn = Button.create(50, 50)
    // Build top & bottom covers and position reelContainer
    // const app = engine.app
    // const btn = new Button()
    // engine.add(btn)
/*    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

    const reelContainer = new PIXI.Container()
    reelContainer.y = 50;
    reelContainer.x = 50

    const bottom = new PIXI.Graphics()
    bottom.beginFill(0, 1)
    bottom.drawRect(100, SYMBOL_SIZE * 3 + margin, 100, 100)

    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'normal',
        fontWeight: 'bold',
        fill: '#FFD688',
        wordWrap: true,
        wordWrapWidth: 440,
    })
    style.fontSize
    const playText = new PIXI.Text('Spin the wheels!', style)
    playText.x = Math.round((bottom.width - playText.width) / 2)
    playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2)
    // bottom.addChild(playText)
    bottom.interactive = true
    bottom.cursor = 'pointer'
    const graphics = new PIXI.Graphics()
    graphics.lineStyle(2, 0xFFD688, 1);
    graphics.beginFill(0xFFD688, 1);
    graphics.drawRoundedRect(0, 0, 100, 100, 5);
    graphics.endFill();

    reelContainer.addChild(graphics)
    reelContainer.addChild(bottom)
    reelContainer.addChild(playText)

    app.stage.addChild(reelContainer)
    bottom.addListener('pointerdown', (e) => {
        console.log(e)
    })*/
   // createPlayer(engine.app)
}

function SceneUnload(name: string) {
    console.log('SceneMainUnload', name)
}


export class DefaultScene {
    static init() {
        Scene.addScene(DefaultScene.name, SceneLoad, SceneUnload)
        Scene.loadScene(DefaultScene.name)
    }
}
