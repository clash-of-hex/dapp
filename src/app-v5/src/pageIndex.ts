import './style.css'
import { Manager } from './Manager'
import { color } from './color'
import { GameScene } from './scene/GameScene'

Manager.initialize(640, 480, color.darkBlueSecond)
Manager.changeScene(new GameScene())
document.body.appendChild(Manager.view)
