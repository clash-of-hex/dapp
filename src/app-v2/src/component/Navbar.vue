<template>
  <div class="navbar fixed bg-white">
    <div class="flex justify-start lg:w-0 lg:flex-1">
      <router-link to="/" aria-current="page" aria-label="Main page">
        <span class="sr-only">HEX Battle</span>
        <img class="h-8 w-auto sm:h-10" src="@asset/logo.svg" alt="*" />
      </router-link>
    </div>

    <div class="hidden space-x-10 md:flex">
      <router-link
        to="/how-it-work"
        aria-current="page"
        aria-label="How it work"
        class="text-base font-medium text-gray-500 hover:text-gray-900"
        >How it work</router-link
      >
    </div>

    <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
      <a
        href="#"
        class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
        data-behavior="connect"
        >Connect</a
      >
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style>
.navbar {
  width: 100%;
  z-index: 2;
}
</style>
