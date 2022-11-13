"use strict"
//Import CSS
import './styles/main.scss'
//Import JS
import * as DISPLAY from './scripts/display.js'
import * as CONTROLS from './scripts/controls.js'
import * as PROVIDER from './scripts/ever.js'

//https://github.com/flauwekeul/honeycomb
//console.clear();

DISPLAY.initiateMap(PROVIDER)
CONTROLS.initiateControls()

if (module.hot) {
    module.hot.accept()
}