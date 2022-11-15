<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { Engine } from './system/Engine'

const canvas: Ref<Node | null> = ref(null)

onMounted(() => {
  const engine = Engine.init({
    backgroundColor: 0xC7BCFF,
  })
  canvas.value?.appendChild(engine.canvas)
})
</script>

<template>
  <div>
    <div ref="canvas"></div>
  </div>
</template>

<style scoped>
</style>
