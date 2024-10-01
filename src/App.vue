<template>
  <EtherFrame
    title="This is a title"
    :minimizable="true"
    v-on:startResize="(d, e) => console.log({ n: 'start-resize', d, e })"
    v-on:endResize="(d, e) => console.log({ n: 'end-resize', d, e })"
    v-on:startDrag="(d, e) => console.log({ n: 'start-drag', d, e })"
    v-on:endDrag="(d, e) => console.log({ n: 'end-drag', d, e })"
  ></EtherFrame>
</template>

<script setup lang="ts">
import EtherFrame from './components/EtherFrame.vue';
</script>
