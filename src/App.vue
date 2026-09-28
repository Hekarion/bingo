<script setup lang="ts">
import Board from './components/Board.vue'
</script>

<template>
  <main id="app-main">
    <h1 class="h1">EXPRESS BINGO</h1>
    <Board />
  </main>
</template>

<style scoped>
#app-main {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1fr auto;
  align-content: center;
  justify-content: center;
}
</style>
