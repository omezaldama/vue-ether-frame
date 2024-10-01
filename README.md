# Vue Ether Frame
This is an open-source, TypeScript based, frame component for Vue.js 3. It consists of a minimizable window that can be dragged and resized.

## Installation
```
npm install vue-ether-frame
```

## Usage
### Basic usage
```
<template>
  <EtherFrame
    title="This is the title"
  >
    This is some content inside the frame.
  </EtherFrame>
</template>

<script setup lang="ts">
import EtherFrame from 'vue-ether-frame';
</script>
```

### Minimizable
You can use the `minimizable` prop to show a minimize button in the top right corner.
```
<template>
  <EtherFrame
    title="This is the title"
    :minimizable="true"
  >
    This is some content inside the frame.
  </EtherFrame>
</template>
```

### Full example
```
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

import EtherFrame from 'vue-ether-frame';

const ch: Ref<number> = ref(350);
const cw: Ref<number> = ref(450);
const isVisible: Ref<boolean> = ref(true);

const handleMinimize = () => {
  isVisible.value = !isVisible.value;
};
</script>
```

## API

### Props
You can pass the following props to the `EtherFrame` component.
| Prop             | Type      | Default          | Required |
| ---------------- | --------- | -----------------| -------- |
| `minimizable`    | `boolean` | `false`          | No       |
| `title`          | `string`  | [`empty string`] | No       |
| `titlebarHeight` | `number`  | 20               | No       |

### Model props
The following props are exposed as two way data bound variables (using `v-model:{prop}`, this is a [relatively new](https://vuejs.org/guide/components/v-model.html) feature in Vue 3):
| Prop               | Type       | Default             | Required |
| ------------------ | ---------- | ------------------- | -------- |
| `contentHeight`    | `number`   | 180                 | No       |
| `contentWidth`     | `number`   | 260                 | No       |
| `visible`          | `boolean`  | `true`              | No       |
| `x`                | `number`   | 95                  | No       |
| `y`                | `number`   | 60                  | No       |
