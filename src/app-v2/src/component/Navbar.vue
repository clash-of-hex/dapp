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
      <div class="show-address hidden" data-behavior="main">
        address: <span data-behavior="address"></span>
      </div>
      <!-- <div>
        pubkey
        <div data-behavior="publicKey"></div>
      </div> -->
      <div data-behavior="network"></div>
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
  },
};
</script>
<style lang="scss">
.nav {
  width: 100%;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
  padding: 10px 50px;
  font-family: "JetBrains Mono";
  border-bottom: 2px solid #c27400;
  background-color: #00040b;
  color: white;
}
.nav-links {
  align-items: center;
  .logo-link {
    position: relative;
    align-items: center;
    margin-right: 30px;
    .logo-title {
      font-weight: 900;
      font-size: 22px;
      margin-left: 10px;
      font-family: "Roboto";
    }
    .logo {
      height: 50px;
    }
    &:after {
      content: "";
      position: absolute;
      right: -30px;
      background-color: #fff;
      width: 3px;
      height: 100%;
      display: block;
    }
  }
  .tutorial-link {
    font-size: 20px;
    margin-left: 30px;
  }
}
.nav-right {
  display: flex;
  align-items: center;
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
</style>
