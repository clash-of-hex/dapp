<template>
  <div class="nav fixed">
    <div class="nav-links flex">
      <router-link
        to="/"
        aria-current="page"
        aria-label="Main page"
        class="logo-link flex"
      >
        <img class="logo" src="@asset/logo.svg" alt="*" />
        <span class="logo-title">Clash of Hex</span>
      </router-link>

      <router-link
        to="/how-it-work"
        aria-current="page"
        aria-label="How it work"
        class="tutorial-link font-medium"
        >How to play?</router-link
      >
    </div>
    <div class="nav-right">
      <!-- <div>
        pubkey
        <div data-behavior="publicKey"></div>
      </div> -->
      <div class="mobile-info-wrapper">
        <div class="show-info">
          <button @click="toggleInfo()">info</button>
          <img
            class="arrow-image"
            src="/arrow.svg"
            :class="[infoVisible ? 'down' : 'up']"
          />
        </div>
        <div v-show="infoVisible" class="mobile-info">
          <div class="show-time" data-behavior="timeLeft"></div>
          <div class="show-address" data-behavior="main">
            address: <span data-behavior="address"></span>
          </div>
          <div data-behavior="network"></div>
        </div>
      </div>
      <div class="game-info">
        <div class="show-time" data-behavior="timeLeft"></div>
        <div class="show-address hidden" data-behavior="main">
          address: <span data-behavior="address"></span>
        </div>
        <div data-behavior="network"></div>
      </div>
      <div class="hidden" data-behavior="login">
        <a
          href="#"
          class="connect-button ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent px-4 py-2 text-base font-medium"
          data-behavior="connect"
          >Connect EVER Wallet</a
        >
      </div>
      <div class="hidden" data-behavior="main">
        <a
          href="#"
          class="connect-button ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent px-4 py-2 text-base font-medium"
          data-behavior="disconnectAction"
          >Disconnect</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as EVER from "../services/ever.js";
// import * as appStore from "../store";

export default {
  data() {
    return {
      connected: false,
      details: {},
      infoVisible: false,
    };
  },
  async mounted() {
    try {
      this.details = await EVER.routerDetails();
      if (this.details) {
        this.connected = true;
      } else {
        this.connected = false;
        this.details = {};
      }
    } catch (err) {
      this.connected = false;
    }
  },
  methods: {
    async connectWallet() {
      try {
        if (this.connected) {
          await EVER.disconnectAction();
          this.connected = false;
        } else {
          await EVER.connect();
          this.connected = true;
        }
      } catch (err) {
        console.log(err);
      }
    },
    toggleInfo(){
      this.infoVisible = !this.infoVisible;
    }
  },
};
</script>
<style lang="scss">
.nav {
  user-select: none;
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
  padding: 10px 50px;
  font-family: "JetBrains Mono";
  border-bottom: 2px solid #c27400;
  background-color: #00040b;
  color: white;

  .nav-links {
    align-items: center;
    .logo-link {
      position: relative;
      align-items: center;
      margin-right: 30px;
      &:after {
        content: "";
        position: absolute;
        right: -30px;
        background-color: #fff;
        width: 3px;
        height: 50px;
        display: block;
      }
    }
    .logo-title {
      font-weight: 900;
      font-size: 22px;
      margin-left: 10px;
      font-family: "Roboto";
    }
    .logo {
      height: 50px;
      width: 50px;
    }
    .tutorial-link {
      font-size: 20px;
      margin-left: 30px;
    }

  }
  @media screen and (max-width: "800px") {
    padding: 10px 20px;
    .nav-links {
      .logo {
        width: 40px;
        height: 40px;
      }
      .logo-title {
        font-size: 18px;
      }
      .tutorial-link {
        font-size: 17px;
      }
    }
  }
  @media screen and (max-width: "550px") {
    padding: 10px 20px;
    .nav-links {
      .logo-link {
        margin-right: 0;
        &:after {
          display: none;
        }
      }
      .logo-title {
        display: none;
      }
      .tutorial-link {
        margin-left: 10px;
      }
    }
  }
  .nav-right {
    display: flex;
    align-items: center;
    .game-info {
      display: flex;
    }
    .mobile-info-wrapper {
      display: none;
    }
    .mobile-info-wrapper {
      position: relative;
    }
    .mobile-info {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 40px;
      left: 0;
      width: 200px;
      padding: 10px;
      background: rgba(0, 4, 11, 0.9);
    }

    @media screen and (max-width: "1200px") {
      .mobile-info-wrapper {
        display: block;
        .show-info {
          color: #00e4ff;
          display: flex;
          cursor: pointer;
          .arrow-image {
            height: 10px;
            margin-right: 10px;
            margin-top: 8px;
            transition: 0.3s;
            &.down {
              transform: rotate(180deg);
            }
          }
        }
      }
      .mobile-info div {
        margin-right: 0;
        margin-bottom: 20px;
      }
      .game-info {
        display: none;
      }
    }
    .connect-button {
      background-color: #ffc700;
      color: #001d37;
      font-family: "JetBrains Mono Bold";
    }
    .show-address {
      margin-right: 20px;
      span {
        margin-left: 10px;
      }
    }
    .show-time {
      color: #69e0ee;
      margin-right: 20px;
    }
  }
}
</style>
