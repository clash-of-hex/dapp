<script setup>
import icon from "./icon";
const navigation = [
  { name: "GitHub", icon: icon.GitHub, href: "https://github.com/hex-battle-game/dapp" },
  { name: "Discussions", icon: icon.Discussions, href: "https://github.com/orgs/hex-battle-game/discussions" },
];
</script>

<template>
  <footer
    class="footer footer-center sticky bottom-0 border-t border-base-100 bg-base-200 px-4 pt-2 text-base-content opacity-90"
  >
    <div class="flex w-full max-w-6xl flex-row items-center justify-between gap-6">
      <div class="mx-auto max-w-7xl py-2 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div class="flex justify-center space-x-6 md:order-2">
          <a v-for="item in navigation" :key="item.name" :href="item.href" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
