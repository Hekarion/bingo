<script setup lang="ts">

</script>

<template>
    <section id="author-container"> 
        <a class="logo-link" href="https://github.com/Martimex" target="_blank">
            <div class="logo-icon"> </div>
        </a>
        <p class="logo-text NO-SELECT"> <span class="DECO"> { </span> &copy; 2026 <span class="DECO"> } </span> </p>
    </section>
</template>

<style scoped lang="css">

#author-container {
    display: flex;
    width: fit-content;
    align-items: end;
    position: absolute;
    bottom: 1rem;
    left: 1rem;
}

.logo-icon {
    aspect-ratio: 1 / 1;
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 0.5rem;
    background-color: #222;
    background-image: url('./logo.svg');
    background-repeat: no-repeat;
    background-size: contain;
    box-shadow: 0 0 .3rem .1rem hsl(121, 70%, 40%);
}

.logo-text {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1rem;
    font-weight: 400;
    margin-left: 1rem;
}

.logo-link {
    color: #222;

    &:hover {
        text-decoration: underline;
        cursor: pointer;
        color: hsl(121, 70%, 40%);
    }
}

</style>