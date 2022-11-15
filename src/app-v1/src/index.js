"use strict"
//Import JS
import * as DISPLAY from './scripts/display.js'
import * as CONTROLS from './scripts/controls.js'
import * as PROVIDER from './scripts/ever.js'

//https://github.com/flauwekeul/honeycomb
DISPLAY.initiateMap(PROVIDER)
CONTROLS.initiateControls()
