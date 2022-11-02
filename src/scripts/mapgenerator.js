//Imports
import {
    extendHex,
    defineGrid
} from 'honeycomb-grid'

//Public variables
//-

//Private variables
let Grid = defineGrid(extendHex({
    orientation: 'flat'
}))

//Public functions
export function getRandomMap(width, height) {
    let map = Grid.rectangle({
        width: width,
        height: height
    })
    //Basic water layer
    for (let hex of map) {
        hex.type = "64, 128, 255"
        hex.highlight = false
    }
    // //Ring of sand
    // let island = map.hexesInRange(map.get([Math.floor(size / 2), Math.floor(size / 2)]), (size - 7) / 2)
    // island.forEach((hex) => {
        // hex.type = "234,206,106"
        // hex.walkable = true
    // })
    // //Inland terrain
    // island = map.hexesInRange(map.get([Math.floor(size / 2), Math.floor(size / 2)]), ((size - 7) / 2) - 1)
    // island.forEach((hex) => {
        // hex.type = "0,128,0" //["0,128,0", "139,69,19"].random()
    // })
    // //Vision blocking blocks
    // island.forEach((hex) => {
        // if (Math.random() > 0.85) {
            // hex.type = "50,50,50"
            // hex.seeThrough = false
            // hex.walkable = false
        // }
    // })
    return map
}

//Private functions
Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

/*
let img = new Image()
img.src = 'url'
let pattern = ctx.createPattern(img, 'repeat')
*/