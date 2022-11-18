import './style.css'
import { Manager } from './Manager'
import { UIScene } from './scene/UIScene'

Manager.initialize(640, 480, 0x999999)
Manager.changeScene(new UIScene())
document.body.appendChild(Manager.view)
