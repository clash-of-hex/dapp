"use strict"
//Import CSS
import './styles/main.scss'
//Import JS
import * as MAPGENERATOR from './scripts/mapgenerator.js'
import * as DISPLAY from './scripts/display.js'
import * as CONTROLS from './scripts/controls.js'
import * as PROVIDER from './scripts/ever.js'

//https://github.com/flauwekeul/honeycomb
//console.clear();

// let map = MAPGENERATOR.getMap(5)
DISPLAY.initiateMap(PROVIDER)
CONTROLS.initiateControls()

if (module.hot) {
    module.hot.accept()
}