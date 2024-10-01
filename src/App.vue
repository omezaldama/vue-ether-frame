<template>
  <button type="button" v-on:click="handleMinimize">Click here to minimize/maximize</button>
  <EtherFrame
    title="A circle at the middle"
    :titlebarHeight="55"
    :minimizable="true"
    v-model:contentHeight="ch"
    v-model:contentWidth="cw"
    v-model:visible="isVisible"
    v-on:startResize="(data, nativeEvent) => console.log({ eventType: 'start resize', data, nativeEvent })"
    v-on:endResize="(data, nativeEvent) => console.log({ eventType: 'end resize', data, nativeEvent })"
    v-on:startDrag="(data, nativeEvent) => console.log({ eventType: 'start drag', data, nativeEvent })"
    v-on:endDrag="(data, nativeEvent) => console.log({ eventType: 'end drag', data, nativeEvent })"
  >
    <svg :width="cw" :height="ch">
      <circle :cx="cw/2" :cy="ch/2" r="10" />
    </svg>
  </EtherFrame>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

import EtherFrame from './components/EtherFrame.vue';

const ch: Ref<number> = ref(350);
const cw: Ref<number> = ref(450);
const isVisible: Ref<boolean> = ref(true);

const handleMinimize = () => {
  isVisible.value = !isVisible.value;
};
</script>
