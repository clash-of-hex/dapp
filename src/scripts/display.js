//Imports
import { defineHex, Grid, spiral, hexToPoint } from 'honeycomb-grid'

//Public variables
export const camera = {
    x: 0,
    y: 0,
    zoom: 1
}
export let currentMap
const Hex = defineHex({ dimensions: 60, orientation: 'FLAT', origin: { x: -500, y: -400 } })

//Private variables
const mainCanvas = document.querySelector("#mainCanvas")
const animCanvas = document.querySelector("#animationCanvas")
const mainCtx = mainCanvas.getContext("2d")
const animCtx = animCanvas.getContext("2d")
let scales = []
let hexSize
let a_full, b_full, c_full, a_hex, b_hex, c_hex
let halfCanvasWidth, halfCanvasHeight
let grid =  new Grid(Hex)
let PROVIDER
let isdblclick = false

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 

export function getMap(radius) {
    let map = new Grid(Hex, spiral({ radius: radius }))
    //Basic water layer
    for (let hex of map) {
        hex.type = "64, 128, 255"
        hex.highlight = false
    }
    return map
}

//Public functions
export async function initiateMap(ever) {
    currentMap = getMap(5);
    mainCanvas.width = window.innerWidth
    mainCanvas.height = window.innerHeight
    animCanvas.width = window.innerWidth
    animCanvas.height = window.innerHeight
    calculateHexDimensions()
    windowResizeUpdate()
    zoomUpdate()
    drawMap()
    camera.x = halfCanvasWidth;
    camera.y = halfCanvasHeight;
    
    PROVIDER = ever
    await PROVIDER.init(currentMap)
    recalcEnergy();
    
}

function recalcEnergy() {
    for (let hex of currentMap) {
      if (!hex.details) continue
      calculateEnergy(hex);
    }
    setTimeout(recalcEnergy, 1000);
}
  
function calculateEnergy(hex) {
    let dateNow = Math.round(Date.now()/1000);
    if (1*hex.details.energy >= 1*hex.details.energyMax || 1*hex.details.lastCalcTime >= dateNow) {
        return;
    }
    let energy = Math.min(
        1*hex.details.energy + hex.details.energySec * (dateNow - hex.details.lastCalcTime),
        1*hex.details.energyMax
    ); 
    hex.details.lastCalcTime = dateNow;
    hex.details.energy = energy
}
  
export function zoomUpdate() {
    const hex = grid.pointToHex({ x: camera.x, y: camera.y })
    const x = hex.x
    const y = hex.y
    hexSize = scales[camera.zoom]
    calculateHexDimensions()
    let replacementMap = new Grid(Hex, spiral({ radius : currentMap.radius }));
    for (let i = 0; i < currentMap.length; i++) {
        currentMap[i].size = replacementMap[i].size
        if (currentMap[i].x === x && currentMap[i].y === y) {
            camera.x = Math.round(hexToPoint(currentMap[i]).x + b_full + (hexSize / 2))
            camera.y = Math.round(hexToPoint(currentMap[i]).y + c_full)
        }
    }
}

//Private functions
function drawMap() {
    //Clearing
    mainCtx.setTransform(1, 0, 0, 1, 0, 0)
    mainCtx.fillStyle = "black"
    mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height)

    //Positioning the camera
    mainCtx.translate(-camera.x + halfCanvasWidth, -camera.y + halfCanvasHeight)

    for (let hex of currentMap) {
        //Hex is ignored if it wasn't seen yet
        //if (hex.visibility === 'unseen') continue
        // console.log('hex', hex)
        // console.log('hexToPoint', hexToPoint(hex))
        let x = hexToPoint(hex).x,
            y = hexToPoint(hex).y

        //Checking if hex is visible within canvas
        if (Math.abs(x - camera.x) > halfCanvasWidth + hexSize ||
            Math.abs(y - camera.y) > halfCanvasHeight + hexSize) continue

        //Drawing highlight around hex
        if (hex.highlight) {
            mainCtx.strokeStyle = "white"
            mainCtx.beginPath()
            mainCtx.moveTo(x + a_full, y - c_full)
            mainCtx.lineTo(x + b_full, y)
            mainCtx.lineTo(x + a_full, y + c_full)
            mainCtx.lineTo(x - a_full, y + c_full)
            mainCtx.lineTo(x - b_full, y)
            mainCtx.lineTo(x - a_full, y - c_full)
            mainCtx.closePath()
            mainCtx.stroke()
        }

        //Drawing the hex
        let color = hex.details ? `${hex.details.color.r}, ${hex.details.color.g}, ${hex.details.color.b}` : hex.type
        mainCtx.fillStyle = `rgba(${color},1)`
        mainCtx.beginPath()
        mainCtx.moveTo(x + a_hex, y - c_hex)
        mainCtx.lineTo(x + b_hex, y)
        mainCtx.lineTo(x + a_hex, y + c_hex)
        mainCtx.lineTo(x - a_hex, y + c_hex)
        mainCtx.lineTo(x - b_hex, y)
        mainCtx.lineTo(x - a_hex, y - c_hex)
        mainCtx.closePath()
        mainCtx.fill()

        setText(mainCtx, x, y-hexSize/2, `${hex.q};${hex.r}`)
        if (hex.details) {
          setText(mainCtx, x, y, `${hex.details.energy}`)
          setText(mainCtx, x, y+hexSize/2, `lvl: ${1*hex.details.level+1}`)
        }

    }

    requestAnimationFrame(drawMap)
}

function setText(ctx, x, y, txt, fontSize = 10, style = "white", align = 'center') {
    let _font = `${fontSize*(camera.zoom+1)}px Georgia`
    ctx.font = _font;
    ctx.fillStyle = style;
    ctx.textAlign = align;
    ctx.fillText(txt, x, y, hexSize);
}
  
function calculateHexDimensions() {
    a_full = hexSize / 2
    b_full = hexSize
    c_full = hexSize / 2 * Math.sqrt(3)
    a_hex = a_full * 0.95
    b_hex = b_full * 0.95
    c_hex = c_full * 0.95
}

function windowResizeUpdate() {
    mainCanvas.width = window.innerWidth
    mainCanvas.height = window.innerHeight
    animCanvas.width = window.innerWidth
    animCanvas.height = window.innerHeight
    halfCanvasWidth = mainCanvas.width / 2
    halfCanvasHeight = mainCanvas.height / 2
    const min = Math.min(halfCanvasWidth, halfCanvasHeight)
    scales = [min / 10, min / 7, min / 5]
}

//Hex Highlighting
animCanvas.addEventListener('click', async ({
    offsetX,
    offsetY
}) => {
    console.log('click', isdblclick);
    await sleep(500);
    console.log('click', isdblclick);
    if (isdblclick) {
      return;
    }
    offsetX += camera.x - (mainCanvas.width / 2)
    offsetY += camera.y - (mainCanvas.height / 2)
    const hexCoordinates = grid.pointToHex({ x: offsetX, y: offsetY })
    for (let hex of currentMap) {
      if (hex.x == hexCoordinates.x && hex.y == hexCoordinates.y) {
        hex.highlight = !hex.highlight
      } else {
        hex.highlight = false
      }
    }
})

animCanvas.addEventListener('dblclick', async ({
    offsetX,
    offsetY
}) => {
    isdblclick = true
    console.log('dblclick', isdblclick);
    await sleep(500);
    isdblclick = false
    console.log('dblclick', isdblclick);
    offsetX += camera.x - (mainCanvas.width / 2)
    offsetY += camera.y - (mainCanvas.height / 2)
    const hexCoordinates = grid.pointToHex({ x: offsetX, y: offsetY })
    console.log(hexCoordinates)
    let hHex
    let tHex
    for (let hex of currentMap) {
      if (hex.highlight) {
        hHex = hex
      }
      if (hex.x == hexCoordinates.x && hex.y == hexCoordinates.y) {
        tHex = hex
      }
    }
    if (!tHex) return;
    if (hHex && !hHex.details) return;
    console.log('hHex', hHex);
    console.log('tHex', tHex);
    let cellCoord = {
      x: hexCoordinates.q,
      y: hexCoordinates.r,
      z: hexCoordinates.s
    }
    if (!hHex) {
      if (!tHex.details) {
        await PROVIDER.newGame(cellCoord);
      }
    } else if (hHex.address.toString() == tHex.address.toString()) {
      await PROVIDER.upgradeCell(tHex.address);
    } else {
      if (!isNeighborHex(hHex, tHex)) return;
      let energy = 1000;
      if (!tHex.details) {
        await PROVIDER.markCell(hHex.address, cellCoord, energy);
      } else if (colorIsEqual(hHex.details.color, tHex.details.color)) { // переписать условие по владельцу ячейки и цвета
        await PROVIDER.helpCell(hHex.address, cellCoord, energy);
      } else {
        await PROVIDER.attkCell(hHex.address, cellCoord, energy);
      }
    }

})

function colorIsEqual(color1, color2) {
    return color1.r == color2.r && color1.g == color2.g && color1.b == color2.b
}

function isNeighborHex(hex1, hex2) {
    return cube_distance(hex1, hex2) == 1;
}

function cube_distance(hex1, hex2) {
    return Math.max(Math.abs(hex1.q - hex2.q), Math.abs(hex1.r - hex2.r), Math.abs(hex1.s - hex2.s));
}

window.addEventListener('resize', () => {
    windowResizeUpdate()
    zoomUpdate()
})

//http://jsfiddle.net/gfcarv/QKgHs/ or http://jsfiddle.net/gfcarv/tAwQV/
//https://jsfiddle.net/931wk75n/2/