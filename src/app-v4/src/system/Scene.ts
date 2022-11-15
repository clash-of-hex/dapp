type SceneItem = {
    load: SceneUnload
    unload: SceneLoad
}
export type SceneUnload = (name: string) => void
export type SceneLoad = (name: string) => void

const MAP: { [key: string]: SceneItem } = {}

let currentScene = 'DefaultScene'
let isFirstLoad = false

export class Scene {

    static loadScene(sceneToLoad: string) {
        if (!MAP[sceneToLoad]) {
            throw new Error(`No Scene Named: ${sceneToLoad}`)
        }
        if (!isFirstLoad) {
            if (MAP[currentScene]) {
                MAP[currentScene].unload(sceneToLoad)
            }
        } else {
            isFirstLoad = false
        }
        MAP[currentScene].load(sceneToLoad)
    }

    static addScene(name: string, onLoad: SceneLoad, onUnload: SceneUnload) {
        MAP[name] = {
            load: onLoad,
            unload: onUnload,
        }
    }
}
