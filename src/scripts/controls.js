//Imports
import * as DISPLAY from '../scripts/display.js'

//Public variables
//-

//Private variables
//-

//Public functions
export function initiateControls() {

    //Camera position controls
    let timer = null;
    document.addEventListener('mouseup', () => {
        clearInterval(timer)
    })
    document.addEventListener('keyup', () => {
        clearInterval(timer)
    })

    //Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case "ArrowUp":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.y -= 5
                }, 10)
                break
            case "ArrowLeft":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.x -= 5
                }, 10)
                break
            case "ArrowRight":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.x += 5
                }, 10)
                break
            case "ArrowDown":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.y += 5
                }, 10)
                break
        }
    })
}

//Private functions

