//Imports
import * as DISPLAY from '../scripts/display.js'

//Public variables
//-

//Private variables
//-

//Public functions
export function initiateControls() {

    //Zoom controls
    document.querySelector("#zoom_out").addEventListener('mousedown', () => {
        if (DISPLAY.camera.zoom > 0) DISPLAY.camera.zoom--
        DISPLAY.zoomUpdate()
    })

    document.querySelector("#zoom_in").addEventListener('mousedown', () => {
        if (DISPLAY.camera.zoom < 2) DISPLAY.camera.zoom++
        DISPLAY.zoomUpdate()
    })

    //Camera position controls
    let timer = null;
    document.addEventListener('mouseup', () => {
        clearInterval(timer)
    })
    document.addEventListener('keyup', () => {
        clearInterval(timer)
    })

    document.querySelector("#camera_up").addEventListener('mousedown', () => {
        timer = setInterval(() => {
            DISPLAY.camera.y -= 5
        }, 10)
    })

    document.querySelector("#camera_left").addEventListener('mousedown', () => {
        timer = setInterval(() => {
            DISPLAY.camera.x -= 5
        }, 10)
    })

    document.querySelector("#camera_right").addEventListener('mousedown', () => {
        timer = setInterval(() => {
            DISPLAY.camera.x += 5
        }, 10)
    })

    document.querySelector("#camera_down").addEventListener('mousedown', () => {
        timer = setInterval(() => {
            DISPLAY.camera.y += 5
        }, 10)
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

