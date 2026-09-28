import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { BingoPositionMappingObj } from '@/types/allTypes';

export const useProgressStore = defineStore('progress', () => {

  const gameBoardSize = ref<number>(4);
  
  const get_gameBoardSize = computed(() => gameBoardSize.value)
  
  function set_gameBoardSize(s: number) {
    gameBoardSize.value = s;
  }


  /* */

  const get_isBingo = computed(() => 
    bingoMatchesObj.value.xMatches.length || bingoMatchesObj.value.yMatches.length
  );

  /* */

  const bingoCellsArr = ref<boolean[]>([]);

  const get_bingoCellsArr = computed(() => bingoCellsArr.value);

  function update_bingoCellsArr(ind: number, isBingo: boolean) {
    bingoCellsArr.value[ind] = isBingo;
  }

  /*  */

  const checkmarksCellsObj = ref<BingoPositionMappingObj>({ xPositions: {}, yPositions: {} });
  const get_checkmarksCellsObj = computed(() => checkmarksCellsObj.value);
  function addTo_checkmarkCellsObj(coords: { x: number, y: number}) { 
    checkmarksCellsObj.value.xPositions.hasOwnProperty(`${coords.x}`)? checkmarksCellsObj.value.xPositions[`${coords.x}`]! += 1 : checkmarksCellsObj.value.xPositions[`${coords.x}`] = 1;
    checkmarksCellsObj.value.yPositions.hasOwnProperty(`${coords.y}`)? checkmarksCellsObj.value.yPositions[`${coords.y}`]! += 1 : checkmarksCellsObj.value.yPositions[`${coords.y}`] = 1;
  }
  function removeFrom_checkmarkCellsObj(coords: {x: number, y: number}) {
    checkmarksCellsObj.value.xPositions[`${coords.x}`]! -= 1;
    checkmarksCellsObj.value.yPositions[`${coords.y}`]! -= 1;
  }


  const bingoMatchesObj = ref<{ xMatches: number[], yMatches: number[] }>({xMatches: [], yMatches: []});
  const get_bingoMatchesObj = computed(() => bingoMatchesObj.value);
  function add_BingoMatch(details: {coord: 'x' | 'y', positionIndex: number }) {
    if(details.coord === 'x') bingoMatchesObj.value.xMatches.push(details.positionIndex); 
    if(details.coord === 'y') bingoMatchesObj.value.yMatches.push(details.positionIndex);
  }
  function remove_BingoMatch(details: {coord: 'x' | 'y', positionIndex: number }) {
    if(details.coord === 'x') {
      const indexToRemove = bingoMatchesObj.value.xMatches.indexOf(details.positionIndex);
      if(indexToRemove > -1) { bingoMatchesObj.value.xMatches.splice(indexToRemove, 1) }
    }
    if(details.coord === 'y') {
      const indexToRemove = bingoMatchesObj.value.yMatches.indexOf(details.positionIndex);
      if(indexToRemove > -1) { bingoMatchesObj.value.yMatches.splice(indexToRemove, 1) }
    }
  }

  return { 
    gameBoardSize, get_gameBoardSize, set_gameBoardSize,
    get_isBingo,
    bingoCellsArr, get_bingoCellsArr, update_bingoCellsArr,
    checkmarksCellsObj, get_checkmarksCellsObj, addTo_checkmarkCellsObj, removeFrom_checkmarkCellsObj,
    bingoMatchesObj, get_bingoMatchesObj, add_BingoMatch, remove_BingoMatch
  }
})
