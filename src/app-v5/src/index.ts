import './style.css'
import { Game } from './Game'

Game.setup({
    backgroundColor: 0x00050b,
})

document.body.appendChild(Game.view)
