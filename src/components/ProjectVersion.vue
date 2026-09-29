<script setup lang="ts">

</script>

<template>
    <section id="version-container"> 
        <a class="version-link" href="https://github.com/Hekarion/bingo#changelog" target="_blank">
            <p class="version-text NO-SELECT"> Version <span class="DECO"> [</span> <span class="version-number"> 1.0.6 </span>  <span class="DECO">] </span> </p>
        </a>
    </section>
</template>

<style scoped lang="css">

#version-container {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
}

.version-text {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    text-decoration: underline;
}

.version-number {
    font-weight: 700;
}

.version-link {
    color: #222;

    &:hover {
        text-decoration: underline;
        cursor: pointer;
        color: hsl(121, 70%, 40%);
    }
}

</style>