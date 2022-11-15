import {Application} from '@pixi/app'
import {TickerPlugin} from '@pixi/ticker'
import { extensions } from '@pixi/extensions'
import {skipHello} from '@pixi/utils'
import {Sprite} from '@pixi/sprite'
import {DisplayObject, Container} from '@pixi/display'
import {DefaultScene} from '../scene/DefaultScene'
import {Controller} from './controller'

extensions.add(TickerPlugin)

let engine: Engine

export interface Config {
    backgroundColor: number
}

export class Engine {
    private readonly app: Application

    constructor(config: Config) {
        skipHello()
        const screenWidth = Math.min(window.innerWidth, window.visualViewport?.width || 0)
        const screenHeight = Math.min(window.innerHeight, window.visualViewport?.height || 0)
        this.app = new Application({
            backgroundColor: config.backgroundColor,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            width: screenWidth,
            height: screenHeight,
        })

        //this.render()
        // const conty: Container = new Container()
        // conty.x = 200
        // conty.y = 0
        // this.app.stage.addChild(conty)
        // const clampy: Sprite = Sprite.from('apple-icon-180.png')
        // clampy.x = 100
        // clampy.y = 100
        // conty.addChild(clampy)

    }

    static get instance(): Engine {
        if (typeof engine == 'undefined') {
            throw new Error('Engine not init')
        }
        return engine
    }

    static init(config: Config): Engine {
        engine = new Engine(config)

        // Controller.init()
        DefaultScene.init()
        return engine
    }

    add<T extends DisplayObject>(children: T): void {
        this.app.stage.addChild(children)
    }

    get canvas(): HTMLCanvasElement {
        return this.app.view
    }

    get screen() {
        return this.app.screen
    }

    render() {
        const frame = (): void => {
            this.app.render()
            requestAnimationFrame(frame)
        }
        requestAnimationFrame(frame)
    }
}
