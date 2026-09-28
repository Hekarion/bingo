<script setup lang="ts">
import type { BingoTask } from '@/types/allTypes'
import {  ref, computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import CheckMark from '@/icons/CheckMark.vue'
import { storeToRefs } from 'pinia';

const progressStore = useProgressStore();
const { get_bingoCellsArr } = storeToRefs(progressStore)

const rootEl = ref<HTMLDivElement>();
defineExpose({ rootEl })

const props = defineProps<{
    cellIndex: number,
    coords: { x: number, y :number },
    task: BingoTask,
    isTaskDone: boolean,
    isPartOfBingo: boolean
}>();

const isBingo = computed(() => get_bingoCellsArr.value[props.cellIndex - 1])

const emits = defineEmits(['checkBingoConditions']);

const isTaskCompleted = ref<boolean>(props.isTaskDone);

function handleBoardCellClick() {
    isTaskCompleted.value = !isTaskCompleted.value;
    emits('checkBingoConditions', { isTaskCompleted: isTaskCompleted.value, coords: { x: props.coords.x, y: props.coords.y } });
}

</script>

<template>
    <div class="board-cell layer" @click="handleBoardCellClick()" ref="rootEl">
        <div v-show="isBingo" class="bingo-mask layer"> 
            <CheckMark />
        </div>
        <div v-show="isTaskCompleted" class="bingo-bg layer"></div>
        <p class="bingo-task-text">{{ task.name }}</p>
    </div>
</template>


<style scoped lang="css">


.board-cell {
    --border-col: black;
    --shadow-col: #222; 

    position: relative;
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        cursor: pointer;
    }
}

.bingo-task-text {
    font-size: 0.9rem;
    margin: 1rem;
    text-align: center;
    font-weight: 700;
    word-wrap: break-word;
    text-transform: uppercase;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}

.bingo-mask {
    --border-col: hsl(121, 40%, 60%);
    --shadow-col: hsl(121, 60%, 60%); 

    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #fffd;
    backdrop-filter: blur(2px); 
}

.bingo-bg {
    --border-col: hsl(121, 40%, 60%);
    --shadow-col: hsl(121, 60%, 60%);

    position: absolute;
    width: 100%;
    height: 100%;
    background-color: hsla(121, 80%, 70%, 0.4);
}

.layer {
    border-radius: 5%;
    box-shadow: inset 0 0 0.5rem 0.1rem var(--shadow-col);  
    border: 0.15rem solid var(--border-col);
}

</style>