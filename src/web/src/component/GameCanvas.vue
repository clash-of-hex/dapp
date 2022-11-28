<script>
import { defineHex, Grid, spiral, hexToPoint } from "honeycomb-grid";
import * as EVER from "../services/ever.js";
const Hex = defineHex({
  dimensions: 52,
  orientation: "FLAT",
  origin: { x: -500, y: -400 },
  highlight: false,
});
let grid = new Grid(Hex);
let currentMap = [];
let PROVIDER = EVER;

function getMap(radius) {
  let map = new Grid(Hex, spiral({ radius: 1 * radius }));
  for (let hex of map) {
    hex.type = "#001D37";
    hex.highlight = false;
  }
  return map;
}
export default {
  data() {
    return {
      camera: {
        x: 0,
        y: 0,
        zoom: 1,
      },
      mainCanvas: null,
      animCanvas: null,
      mainCtx: null,
      scales: 0,
      hexSize: 0,
      halfCanvasWidth: 0,
      halfCanvasHeight: 0,
      isdblclick: false,
      a_full: 0,
      b_full: 0,
      c_full: 0,
      a_hex: 0,
      b_hex: 0,
      c_hex: 0,
    };
  },
  async mounted() {
    PROVIDER = EVER;
    this.mainCanvas = document.querySelector("#mainCanvas");
    this.animCanvas = document.querySelector("#animationCanvas");
    this.mainCtx = this.mainCanvas.getContext("2d");
    window.addEventListener("resize", () => {
      this.windowResizeUpdate();
      this.zoomUpdate();
    });
    this.initiateControls();
    this.initiateMap(PROVIDER);

    //Hex Highlighting
    this.animCanvas.addEventListener("click", async ({ offsetX, offsetY }) => {
      await this.sleep(250);
      if (this.isdblclick) {
        return;
      }
      offsetX += this.camera.x - this.mainCanvas.width / 2;
      offsetY += this.camera.y - this.mainCanvas.height / 2;
      const hexCoordinates = grid.pointToHex({ x: offsetX, y: offsetY });
      for (let hex of currentMap) {
        if (hex.x == hexCoordinates.x && hex.y == hexCoordinates.y) {
          hex.highlight = !hex.highlight;
        } else {
          hex.highlight = false;
        }
      }
    });

    this.animCanvas.addEventListener(
      "dblclick",
      async ({ offsetX, offsetY }) => {
        this.isdblclick = true;
        await this.sleep(500);
        this.isdblclick = false;
        offsetX += this.camera.x - this.mainCanvas.width / 2;
        offsetY += this.camera.y - this.mainCanvas.height / 2;
        const hexCoordinates = grid.pointToHex({ x: offsetX, y: offsetY });
        let hHex;
        let tHex;
        for (let hex of currentMap) {
          if (hex.highlight) {
            hHex = hex;
          }
          if (hex.x == hexCoordinates.x && hex.y == hexCoordinates.y) {
            tHex = hex;
          }
          // hex.color = "pink";
        }
        if (!tHex) return;
        if (hHex && !hHex.details) return;
        let cellCoord = {
          x: hexCoordinates.q,
          y: hexCoordinates.r,
          z: hexCoordinates.s,
        };
        if (!hHex) {
          if (!tHex.details) {
            await PROVIDER.newGame(cellCoord);
          }
        } else if (hHex.address.toString() == tHex.address.toString()) {
          await PROVIDER.upgradeCell(tHex.address);
        } else {
          if (!this.isNeighborHex(hHex, tHex)) return;
          let energy = this.getEnegry(hHex);
          const _details = await PROVIDER.getDetailsCell(hHex.address);
          if (_details) {
            console.log("_details", _details);
            energy = _details.energy;
          }
          if (!tHex.details) {
            await PROVIDER.markCell(hHex.address, cellCoord, energy);
          } else if (
            this.colorIsEqual(hHex.details.color, tHex.details.color)
          ) {
            // переписать условие по владельцу ячейки и цвета
            await PROVIDER.helpCell(hHex.address, cellCoord, energy);
          } else {
            await PROVIDER.attkCell(hHex.address, cellCoord, energy);
          }
        }
      }
    );
  },
  methods: {
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    async initiateMap() {
      await PROVIDER.init((radius) => {
        currentMap = getMap(radius);
        PROVIDER.setMap(currentMap);
      });
      let mainCanvas = this.mainCanvas;
      let animCanvas = this.animCanvas;
      mainCanvas.width = window.innerWidth;
      mainCanvas.height = window.innerHeight;
      animCanvas.width = window.innerWidth;
      animCanvas.height = window.innerHeight;
      this.calculateHexDimensions();
      this.windowResizeUpdate();
      this.zoomUpdate();
      this.drawMap();
      this.camera.x = this.halfCanvasWidth;
      this.camera.y = this.halfCanvasHeight;

      this.recalcEnergy();
    },
    recalcEnergy() {
      for (let hex of currentMap) {
        if (!hex.details) continue;
        this.calculateEnergy(hex);
      }
      setTimeout(this.recalcEnergy, 200);
    },

    calculateEnergy(hex) {
      let dateNow = Date.now() / 1000;
      if (1 * hex.details.lastCalcTime >= dateNow) {
        return;
      }
      let energy = 1 * hex.details.energy;
      let energyMax = 1 * hex.details.energyMax;

      if (energy > energyMax) {
        let val =
          100 * hex.details.speed * (dateNow - hex.details.lastCalcTime);
        if (energy - val > energyMax) {
          energy = energy - val;
        } else {
          energy = energyMax;
        }
      } else if (energy < energyMax) {
        energy = Math.min(
          energy +
            hex.details.energySec *
              hex.details.speed *
              (dateNow - hex.details.lastCalcTime),
          energyMax
        );
      }
      hex.details.lastCalcTime = dateNow;
      hex.details.energy = Math.floor(energy);
    },

    zoomUpdate() {
      const hex = grid.pointToHex({ x: this.camera.x, y: this.camera.y });
      const x = hex.x;
      const y = hex.y;
      this.hexSize = this.scales;
      this.calculateHexDimensions();
      let replacementMap = new Grid(Hex, spiral({ radius: currentMap.radius }));
      for (let i = 0; i < currentMap.length; i++) {
        currentMap[i].size = replacementMap[i].size;
        if (currentMap[i].x === x && currentMap[i].y === y) {
          this.camera.x = Math.round(
            hexToPoint(currentMap[i]).x + this.b_full + this.hexSize / 2
          );
          this.camera.y = Math.round(hexToPoint(currentMap[i]).y + this.c_full);
        }
      }
    },

    //Private functions
    drawMap() {
      //Clearing
      this.mainCtx.setTransform(1, 0, 0, 1, 0, 0);
      this.mainCtx.fillStyle = "black";
      this.mainCtx.fillRect(
        0,
        0,
        this.mainCanvas.width,
        this.mainCanvas.height
      );
      //Positioning the camera
      this.mainCtx.translate(
        -this.camera.x + this.halfCanvasWidth,
        -this.camera.y + this.halfCanvasHeight
      );

      // this.drawGrid(this.mainCanvas.width, this.mainCanvas.height);

      for (let hex of currentMap) {
        //Hex is ignored if it wasn't seen yet
        //if (hex.visibility === 'unseen') continue
        let x = hexToPoint(hex).x,
          y = hexToPoint(hex).y;

        //Checking if hex is visible within canvas
        if (
          Math.abs(x - this.camera.x) > this.halfCanvasWidth + this.hexSize ||
          Math.abs(y - this.camera.y) > this.halfCanvasHeight + this.hexSize
        )
          continue;

        //Drawing highlight around hex
        if (hex.highlight) {
          this.mainCtx.strokeStyle = "#00E4FF";
          this.mainCtx.beginPath();
          this.mainCtx.moveTo(x + this.a_full, y - this.c_full);
          this.mainCtx.lineTo(x + this.b_full, y);
          this.mainCtx.lineTo(x + this.a_full, y + this.c_full);
          this.mainCtx.lineTo(x - this.a_full, y + this.c_full);
          this.mainCtx.lineTo(x - this.b_full, y);
          this.mainCtx.lineTo(x - this.a_full, y - this.c_full);
          this.mainCtx.closePath();
          this.mainCtx.stroke();
        }

        //Drawing the hex
        // let color = "#001D37";
        // let color = hex.details ? hex.details.color : hex.type;
        let color = hex.details
          ? `${hex.details.color.r}, ${hex.details.color.g}, ${hex.details.color.b}`
          : hex.type;
        this.mainCtx.fillStyle = `rgba(${color},1)`;
        this.mainCtx.fillStyle = color;
        this.mainCtx.strokeStyle = "#0095A7";
        this.mainCtx.beginPath();
        this.mainCtx.moveTo(x + this.a_hex, y - this.c_hex);
        this.mainCtx.lineTo(x + this.b_hex, y);
        this.mainCtx.lineTo(x + this.a_hex, y + this.c_hex);
        this.mainCtx.lineTo(x - this.a_hex, y + this.c_hex);
        this.mainCtx.lineTo(x - this.b_hex, y);
        this.mainCtx.lineTo(x - this.a_hex, y - this.c_hex);
        this.mainCtx.closePath();
        this.mainCtx.stroke();
        this.mainCtx.fill();

        // this.setText(
        //   this.mainCtx,
        //   x,
        //   y - this.hexSize / 2,
        //   `${hex.q};${hex.r}`
        // );

        let star = new Image();
        star.src = "/star.svg";
        let yellowStar = new Image();
        yellowStar.src = "/star-yellow.svg";
        if (hex.details) {
          this.setText(
            this.mainCtx,
            x,
            y - 5,
            `${hex.details.energy}`,
            10,
            "#FFC700",
            true
          );
          // this.setText(
          //   this.mainCtx,
          //   x,
          //   y + this.hexSize / 2,
          //   `lvl: ${1 * hex.details.level + 1}`
          // );
          if (hex.details.level === "0") {
            this.mainCtx.drawImage(yellowStar, x - 23, y + 5, 15, 15);
            this.mainCtx.drawImage(star, x - 8, y + 5, 15, 15);
            this.mainCtx.drawImage(star, x + 7, y + 5, 15, 15);
          } else if (hex.details.level === "1") {
            this.mainCtx.drawImage(yellowStar, x - 23, y + 5, 15, 15);
            this.mainCtx.drawImage(yellowStar, x - 8, y + 5, 15, 15);
            this.mainCtx.drawImage(star, x + 7, y + 5, 15, 15);
          } else if (hex.details.level === "2") {
            this.mainCtx.drawImage(yellowStar, x - 23, y + 5, 15, 15);
            this.mainCtx.drawImage(yellowStar, x - 8, y + 5, 15, 15);
            this.mainCtx.drawImage(yellowStar, x + 7, y + 5, 15, 15);
          }
        } else {
          // this.setText(this.mainCtx, x, y - 5, 0, 10, "#FFC700");
          // this.mainCtx.drawImage(star, x - 23, y + 5, 15, 15);
          // this.mainCtx.drawImage(star, x - 8, y + 5, 15, 15);
          // this.mainCtx.drawImage(star, x + 7, y + 5, 15, 15);
        }
      }

      requestAnimationFrame(this.drawMap);
    },
    // drawGrid(width, height) {
    //   const a = (2 * Math.PI) / 6;
    //   const r = 50;
    //   for (
    //     let i = 0, y = r;
    //     y + r * Math.sin(a) < height;
    //     y += r * Math.sin(a)
    //   ) {
    //     i++;
    //     for (
    //       let x = r, j = 0;
    //       x + r * (1 + Math.cos(a)) < width;
    //       x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)
    //     ) {
    //       currentMap.push({
    //         coords: [i, j],
    //         energy: 5000,
    //         color: "inherit",
    //         lvl: 1,
    //       });
    //       this.drawHexagon(x, y);
    //     }
    //   }
    // },

    // drawHexagon(x, y) {
    //   const a = (2 * Math.PI) / 6;
    //   const r = 50;
    //   this.mainCtx.strokeStyle = "#0095A7";
    //   this.mainCtx.beginPath();
    //   for (let i = 0; i < 6; i++) {
    //     this.mainCtx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    //   }
    //   this.mainCtx.closePath();
    //   this.mainCtx.stroke();
    //   this.setText(this.mainCtx, x, y - this.hexSize / 2, 5000);
    // },

    setText(ctx, x, y, txt, fontSize = 10, style = "white", shadow = false) {
      let _font = `${fontSize * (this.camera.zoom + 1)}px JetBrains Mono`;
      ctx.font = _font;
      ctx.fillStyle = style;
      ctx.textAlign = "center";
      if (shadow){
        ctx.shadowColor="black";
        ctx.shadowBlur=5;
        ctx.lineWidth=5;
      }
      ctx.fillText(txt, x, y, this.hexSize);
      ctx.shadowBlur=0;
    },

    calculateHexDimensions() {
      this.a_full = this.hexSize / 2;
      this.b_full = this.hexSize;
      this.c_full = (this.hexSize / 2) * Math.sqrt(3);
      this.a_hex = this.a_full * 0.95;
      this.b_hex = this.b_full * 0.95;
      this.c_hex = this.c_full * 0.95;
    },

    windowResizeUpdate() {
      this.mainCanvas.width = window.innerWidth;
      this.mainCanvas.height = window.innerHeight;
      this.animCanvas.width = window.innerWidth;
      this.animCanvas.height = window.innerHeight;
      this.halfCanvasWidth = this.mainCanvas.width / 2;
      this.halfCanvasHeight = this.mainCanvas.height / 2;
      // const min = Math.min(this.halfCanvasWidth, this.halfCanvasHeight);
      this.scales = 49;
    },

    getEnegry(hex) {
      if (!hex.details) return 0;
      let percent = 100;
      return Math.floor((hex.details.energy * percent) / 100);
    },

    colorIsEqual(color1, color2) {
      return (
        color1.r == color2.r && color1.g == color2.g && color1.b == color2.b
      );
    },

    isNeighborHex(hex1, hex2) {
      return this.cube_distance(hex1, hex2) == 1;
    },

    cube_distance(hex1, hex2) {
      return Math.max(
        Math.abs(hex1.q - hex2.q),
        Math.abs(hex1.r - hex2.r),
        Math.abs(hex1.s - hex2.s)
      );
    },
    initiateControls() {
      //Camera position controls
      let timer = null;
      document.addEventListener("mouseup", () => {
        clearInterval(timer);
      });
      document.addEventListener("keyup", () => {
        clearInterval(timer);
      });

      //Keyboard controls
      document.addEventListener("keydown", (e) => {
        switch (e.code) {
          case "ArrowUp":
          case "KeyW":
            clearInterval(timer);
            timer = setInterval(() => {
              this.camera.y -= 5;
            }, 10);
            break;
          case "ArrowLeft":
          case "KeyA":
            clearInterval(timer);
            timer = setInterval(() => {
              this.camera.x -= 5;
            }, 10);
            break;
          case "ArrowRight":
          case "KeyD":
            clearInterval(timer);
            timer = setInterval(() => {
              this.camera.x += 5;
            }, 10);
            break;
          case "ArrowDown":
          case "KeyS":
            clearInterval(timer);
            timer = setInterval(() => {
              this.camera.y += 5;
            }, 10);
            break;
          // case "Digit1":
          //   document.querySelector('input[id="energy20"]').checked = true;
          //   break;
          // case "Digit2":
          //   document.querySelector('input[id="energy40"]').checked = true;
          //   break;
          // case "Digit3":
          //   document.querySelector('input[id="energy60"]').checked = true;
          //   break;
          // case "Digit4":
          //   document.querySelector('input[id="energy80"]').checked = true;
          //   break;
          // case "Digit5":
          //   document.querySelector('input[id="energy100"]').checked = true;
          //   break;
        }
      });
    },
  },
};
</script>

<template>
  <div>
    <div>
      <canvas id="mainCanvas"></canvas>
      <canvas id="animationCanvas"></canvas>
    </div>
    <div data-behavior="extension" style="display: none" class="login-status">
      Please install
      <a href="https://everwallet.net/">EVER Wallet</a>
    </div>
    <div data-behavior="login" style="display: none" class="login-status">
      Please authorize your account on the Test Network
    </div>
  </div>
</template>

<style scoped lang="scss">
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

.login-status {
  position: absolute;
  width: 100%;
  top: 100px;
  left: 0;
  text-align: center;
  color: white;
  font-size: 30px;
  a {
    text-decoration: underline;
  }
}
</style>
