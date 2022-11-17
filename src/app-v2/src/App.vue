<script setup lang="ts">
import { logLabeled } from "./util/logger";
import Navbar from "./component/Navbar.vue";
import Footer from "./component/Footer.vue";
</script>

<template>
  <div class="font-chinese antialiased">
    <div class="screen">
      <Navbar />
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.screen {
  min-height: 91vh;
}
</style>