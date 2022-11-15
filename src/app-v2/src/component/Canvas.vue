<script setup lang="ts">
import { defineHex, Grid, rectangle } from 'honeycomb-grid'

// 1. Create a hex class:
const Tile = defineHex({ dimensions: 30 })

// 2. Create a grid by passing the class and a "traverser" for a rectangular-shaped grid:
const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }))

// 3. Iterate over the grid to log each hex:
grid.forEach(console.log)
</script>

<template>
  <p>TBD Canvas</p>
<!--  <table style="position: absolute; right: 0px;">-->
<!--    <tbody>-->
<!--    <tr>-->
<!--      <td></td>-->
<!--      <td><button id="camera_up">- Y ⬆️</button></td>-->
<!--      <td></td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td><button id="camera_left">- X ⬅️</button></td>-->
<!--      <td>📷</td>-->
<!--      <td><button id="camera_right">+ X ➡️</button></td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td><button id="zoom_out">- Zoom</button></td>-->
<!--      <td><button id="camera_down">+ Y ⬇️</button></td>-->
<!--      <td><button id="zoom_in">+ Zoom</button></td>-->
<!--    </tr>-->
<!--    <tr>-->
<!--      <td>network</td>-->
<!--      <td colspan=2><div><p data-behavior="network"></p></div></td>-->
<!--    </tr>-->
<!--    <tr data-behavior="extension" style="display: none">-->
<!--      <td colspan=3>-->
<!--        <div>Need <a href="https://l1.broxus.com/everscale/wallet">EVER Wallet</a></div>-->
<!--      </td>-->
<!--    </tr>-->
<!--    <tr data-behavior="login" style="display: none">-->
<!--      <td colspan=3>-->
<!--        <button type="button" data-behavior="connect">Connect</button>-->
<!--      </td>-->
<!--    </tr>-->
<!--    <tr data-behavior="main" style="display: none">-->
<!--      <td>address</td>-->
<!--      <td colspan=2><div><p data-behavior="address"></p></div></td>-->
<!--    </tr>-->
<!--    <tr data-behavior="main" style="display: none">-->
<!--      <td>pubkey</td>-->
<!--      <td colspan=2><div><p data-behavior="publicKey"></p></div></td>-->
<!--    </tr>-->
<!--    <tr data-behavior="main" style="display: none">-->
<!--      <td colspan=3><button type="button" data-behavior="disconnectAction">Disconnect</button></td>-->
<!--    </tr>-->
<!--    </tbody>-->
<!--  </table>-->
<!--  <canvas id="mainCanvas"></canvas>-->
<!--  <canvas id="animationCanvas"></canvas>-->
</template>

<style scoped>
table {
  margin: auto;
  z-index: 1;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}

tr td {
  color: lawngreen;
  font-size: 20px;
}
tr td div p {
  margin-top: 0;
  margin-bottom: 0;
}
</style>