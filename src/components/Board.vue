<script setup lang="ts">
import type { BingoTasksCollection } from '@/types/allTypes'
import { onBeforeMount, shallowRef, useTemplateRef } from 'vue'
import bingoTasks from '@/data/bingo-tasks'
import { useProgressStore } from '@/stores/progress'
import { storeToRefs } from 'pinia'
import BoardCell from './BoardCell.vue'

const progressStore = useProgressStore();
const { get_gameBoardSize, get_checkmarksCellsObj, get_bingoMatchesObj } = storeToRefs(progressStore);
const { update_bingoCellsArr, addTo_checkmarkCellsObj, removeFrom_checkmarkCellsObj, add_BingoMatch, remove_BingoMatch } = progressStore;

const boardSize = shallowRef<number>(1); /* Will be updated by an initial store value */
const randomizedTasksList = shallowRef<BingoTasksCollection>([]);
const cellsRefs = useTemplateRef<HTMLDivElement[]>('cells');

function changeBingoLayerToCell(coords: { x: number, y: number }, bingoAction: "add" | "remove") {
  if(!cellsRefs.value) return;
  const cellIndex = (coords.x * get_gameBoardSize.value) + coords.y
  if(!cellsRefs.value[cellIndex]) return;
  update_bingoCellsArr(cellIndex, bingoAction === "add"? true : false);
}

function checkIfCellBelongsToAnotherBingo(key: "xPositions" | "yPositions", coords: { x: number, y: number}) {
  const doesCellBelongToOtherBingo = (key === "xPositions")?
    get_bingoMatchesObj.value.yMatches.some(match => match === coords.y) :
    get_bingoMatchesObj.value.xMatches.some(match => match === coords.x);
  return doesCellBelongToOtherBingo;
}

function confirmBingo(key: string, coords: { x: number, y: number }, bingoAction: "add" | "remove") {
  if(key !== "xPositions" && key !== "yPositions") return;

  if(bingoAction === "add") {
    for(let i=0; i<get_gameBoardSize.value; i++) {
      changeBingoLayerToCell({ x: (key==="xPositions")? coords.x : i, y: (key==="yPositions")? coords.y : i }, "add")
    }
  } else {
    for(let i=0; i<get_gameBoardSize.value; i++) {
      const dynamicCoords = { x: (key==="xPositions")? coords.x : i, y: (key==="yPositions")? coords.y : i }
      const testIfCellBelongsToAnotherBingo = checkIfCellBelongsToAnotherBingo(key, dynamicCoords);
      !testIfCellBelongsToAnotherBingo && changeBingoLayerToCell(dynamicCoords, "remove")
    }
  }
}

function runBingoCheck(details: { isTaskCompleted: boolean, coords: { x: number, y: number} }) {
  const checkmarksCells = get_checkmarksCellsObj.value as Record<string, Record<string, number>>
  for(const [key, positions] of Object.entries(checkmarksCells)) {
    for(const [entry, count] of Object.entries(positions)) {
      if(count === get_gameBoardSize.value) {
        const testOccurenceAlreadyInBingo = isOccurenceAlreadyInBingo(key, entry, details.coords, details.isTaskCompleted);
        if(details.isTaskCompleted) {
          if(!testOccurenceAlreadyInBingo) { 
            add_BingoMatch({ coord: (key === "xPositions"? "x" : "y"), positionIndex: Number.parseInt(entry, 10)});
            confirmBingo(key, details.coords, "add");
          }
        } else {
          if(testOccurenceAlreadyInBingo) { 
              console.warn('Removing a bingo!'); 
              remove_BingoMatch({ coord: (key === "xPositions"? "x" : "y"), positionIndex: Number.parseInt(entry, 10)});
              confirmBingo(key, details.coords, "remove");
            }
        }
      }
    }
  }
}

function isOccurenceAlreadyInBingo(objKey: string, entry: string, coords: { x: number, y: number }, isTaskCompleted: boolean) {
  if(isTaskCompleted) {
    if(objKey === "xPositions" && get_bingoMatchesObj.value.xMatches.some(match => `${match}` === entry)) { return true; }
    if(objKey === "yPositions" && get_bingoMatchesObj.value.yMatches.some(match => `${match}` === entry)) { return true; }
  } else {
    if(objKey === "xPositions" && `${coords.x}` === `${entry}` && get_bingoMatchesObj.value.xMatches.some(match => `${match}` === entry)) { return true; }
    if(objKey === "yPositions" && `${coords.y}` === `${entry}` && get_bingoMatchesObj.value.yMatches.some(match => `${match}` === entry)) { return true; }
  }
  return false;
} 

function runToggleCheckmark(details: { isTaskCompleted: boolean, coords: { x: number, y: number} }) {
  if(details.isTaskCompleted) {
    addTo_checkmarkCellsObj({ x: details.coords.x, y: details.coords.y });
    runBingoCheck(details);
  } else {
    runBingoCheck(details);
    removeFrom_checkmarkCellsObj({ x: details.coords.x, y: details.coords.y })
  }
}


onBeforeMount(() => {
  document.documentElement.style.setProperty('--grid-size', `${get_gameBoardSize.value}`)
  boardSize.value = get_gameBoardSize.value;
  /* window.getComputedStyle(document.documentElement).getPropertyValue('--grid-size'); */
  const bingoTasksCopy = [...bingoTasks]
  randomizedTasksList.value = new Array(boardSize.value * boardSize.value)
    .fill('-')
    .reduce((acc) => {
      const indToRetrieve = Math.floor(Math.random() * bingoTasksCopy.length)
      const bingoTask = bingoTasksCopy[indToRetrieve]
      bingoTasksCopy.splice(indToRetrieve, 1)
      return [...acc, bingoTask]
    }, [])
})
</script>

<template>
  <section id="board-section">
    <!-- below v-for index is counting from 1 -->
    <BoardCell v-for="index in boardSize * boardSize" ref="cells" :key="`cell-`+index" 
      :cell-index="index"
      :coords="{
        x: Math.floor((index - 1) / get_gameBoardSize),
        y: (index - 1) % get_gameBoardSize
      }"
      :task="randomizedTasksList[index - 1]!" 
      :isTaskDone="false"
      :isPartOfBingo="false"
      @check-bingo-conditions="runToggleCheckmark"
    />
  </section>
</template>

<style scoped lang="css">

  #board-section {
    border-radius: 2.5%;
    border: 0.5rem solid black;
    display: grid;
    place-self: center;
    grid-template-rows: repeat(
      var(--grid-size),
      min(calc(80vw / var(--grid-size)), min(calc(80vh / var(--grid-size))))
    );
    grid-template-columns: repeat(
      var(--grid-size),
      min(calc(80vw / var(--grid-size)), min(calc(80vh / var(--grid-size))))
    );
  }

  @media screen and (max-width: 640px) {
    #board-section  {
      grid-template-rows: repeat(
        var(--grid-size),
        min(calc(95vw / var(--grid-size)), min(calc(95vh / var(--grid-size))))
      );
      grid-template-columns: repeat(
        var(--grid-size),
        min(calc(95vw / var(--grid-size)), min(calc(95vh / var(--grid-size))))
      );
    }
  }

  @media screen and (max-width: 960px) and (orientation: landscape) {
    #board-section  {
      grid-template-rows: repeat(
        var(--grid-size),
        min(calc(75vw / var(--grid-size)), min(calc(75vh / var(--grid-size))))
      );
      grid-template-columns: repeat(
        var(--grid-size),
        min(calc(75vw / var(--grid-size)), min(calc(75vh / var(--grid-size))))
      );
    }
  }

</style>
