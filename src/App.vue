<script setup lang="ts">
import Board from './components/Board.vue';
import { useProgressStore } from './stores/progress.ts';
import { storeToRefs } from 'pinia';

const progressStore = useProgressStore();
const { get_isBingo } = storeToRefs(progressStore);



</script>

<template>
  <main id="app-main">
    <h1 class="h1" :class="get_isBingo? `bingo` : `no-bingo`" >
      EXPRESS BINGO
    </h1>
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

.no-bingo {
  color: #222;
  text-shadow: 0.1rem 0.1rem 0.25rem #000;
}

.bingo {
  color: hsl(121, 60%, 60%);
  text-shadow: 0.1rem 0.1rem 0.25rem  #222;
  text-decoration: dotted;
}
</style>
