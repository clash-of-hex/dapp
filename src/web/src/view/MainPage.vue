<script setup lang="ts">
import GameCanvas from "../component/GameCanvas.vue";
import Controls from "../component/Controls.vue";
</script>

<template>
  <div class="flex flex-col items-center gap-20 bg-base-100">
    <Controls />
    <GameCanvas />
  </div>
</template>

<style scoped></style>
