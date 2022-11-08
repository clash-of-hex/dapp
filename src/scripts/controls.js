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
      console.log('e.code', e.code)
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.y -= 5
                }, 10)
                break
            case "ArrowLeft":
            case "KeyA":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.x -= 5
                }, 10)
                break
            case "ArrowRight":
            case "KeyD":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.x += 5
                }, 10)
                break
            case "ArrowDown":
            case "KeyS":
                clearInterval(timer)
                timer = setInterval(() => {
                    DISPLAY.camera.y += 5
                }, 10)
                break
            case "Digit1":
                document.querySelector('input[id="energy20"]').checked = true
                break
            case "Digit2":
                document.querySelector('input[id="energy40"]').checked = true
                break
            case "Digit3":
                document.querySelector('input[id="energy60"]').checked = true
                break
            case "Digit4":
                document.querySelector('input[id="energy80"]').checked = true
                break
            case "Digit5":
                document.querySelector('input[id="energy100"]').checked = true
                break
        }
    })
}

//Private functions

