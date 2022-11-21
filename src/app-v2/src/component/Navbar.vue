<template>
  <div class="navbar fixed">
    <router-link
      to="/"
      aria-current="page"
      aria-label="Main page"
      class="logo-link lg:w-0 lg:flex-1 ml-8"
    >
      <img class="h-8 w-auto sm:h-10" src="@asset/logo.svg" alt="*" />
      <span class="logo-title">Clash of Hex</span>
    </router-link>

    <div class="hidden space-x-10 md:flex">
      <router-link
        to="/how-it-work"
        aria-current="page"
        aria-label="How it work"
        class="text-base font-medium"
        >How to play?</router-link
      >
    </div>

    <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0 mr-8">
      <a
        href="#"
        class="connect-button ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent px-4 py-2 text-base font-medium"
        @click="connectWallet"
        >{{ connected ? "Disconnect" : "Connect EVER Wallet" }}</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import * as EVER from "../services/ever.js";
import * as appStore from "../store";

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
    console.log(appStore, 'appStore')
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
<style>
.navbar {
  width: 100%;
  z-index: 3;
  background-color: #00040b;
  color: white;
  padding: 0 30px;
  font-family: "JetBrains Mono";
  border-bottom: 2px solid #c27400;
}

.logo-title {
  font-weight: 900;
  font-size: 20px;
  margin-left: 10px;
  font-family: "Roboto";
}
.connect-button {
  background-color: #ffc700;
  color: #001d37;
  font-family: "JetBrains Mono Bold";
}
</style>
