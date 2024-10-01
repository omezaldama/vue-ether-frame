<template>
  <div
    class="ether-frame"
    :style="{ ...frameStyles }"
    ref="frameRef"
    v-if="visible"
  >
    <div
      class="ether-frame-titlebar"
      :style="{ ...titlebarStyles }"
      v-on:mousedown="handleDrag"
    >
      <span
        class="minimize-button"
        v-on:click="handleMinimize"
        v-if="minimizable"
      >-</span>
      <span class="titlebar-title">{{ title }}</span>
    </div>
    <div
      class="ether-frame-content"
      :style="{ ...contentSize }"
    >
      <slot></slot>
    </div>
    <div
      class="ether-frame-diagonal-resizer"
      v-on:mousedown="handleDiagonalResize"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Ref } from 'vue';

import {
  DEFAULT_CONTENT_HEIGHT, DEFAULT_CONTENT_WIDTH, DEFAULT_TITLEBAR_HEIGHT,
  DEFAULT_X, DEFAULT_Y,
} from '../constants/ether-frame-constants';
import type { EtherFrameProps, ResizeDirection } from '../types/ether-frame-types';
import type { FrameData, ResizeEventData } from '../types/ether-frame-events';

const contentHeight: Ref<number> = defineModel('contentHeight', { default: DEFAULT_CONTENT_HEIGHT, required: false });
const contentWidth: Ref<number> = defineModel('contentWidth', { default: DEFAULT_CONTENT_WIDTH, required: false });
const visible: Ref<boolean> = defineModel('visible', { default: true, required: false });
const x: Ref<number> = defineModel('x', { default: DEFAULT_X, required: false });
const y: Ref<number> = defineModel('y', { default: DEFAULT_Y, required: false });

const props = withDefaults(defineProps<EtherFrameProps>(), {
  minimizable: false,
  title: '',
  titlebarHeight: DEFAULT_TITLEBAR_HEIGHT,
});

const emit = defineEmits<{
  (e: 'endDrag', data: FrameData, event: MouseEvent): void,
  (e: 'endResize', data: ResizeEventData, event: MouseEvent): void,
  (e: 'startDrag', data: FrameData, event: MouseEvent): void,
  (e: 'startResize', data: ResizeEventData, event: MouseEvent): void,
}>();

const frameRef: Ref<HTMLDivElement|null> = ref(null);
const isBeingDragged: Ref<boolean> = ref(false);

const frameStyles = computed(() => ({
  left: `${x.value}px`,
  top: `${y.value}px`,
  width: `${contentWidth.value}px`,
}));
const titlebarStyles = computed(() => ({
  height: `${props.titlebarHeight}px`,
  opacity: isBeingDragged.value ? 0.7 : 1,
}));
const contentSize = computed(() => ({
  height: `${contentHeight.value}px`,
  width: `${contentWidth.value}px`,
}));

const getFrameData = (): FrameData => ({
  contentHeight: contentHeight.value,
  contentWidth: contentWidth.value,
  frameX: x.value,
  frameY: y.value,
});

const handleDrag = (event: MouseEvent) => {
  emit('startDrag', getFrameData(), event);
  isBeingDragged.value = true;

  const initialMouseX = event.clientX;
  const initialMouseY = event.clientY;

  const windowDOMRect = frameRef.value!.getBoundingClientRect();
  const initialWindowX = windowDOMRect.left;
  const initialWindowY = windowDOMRect.top;

  function mousemove(e: MouseEvent) {
    const deltaX = initialMouseX - e.clientX;
    const deltaY = initialMouseY - e.clientY;

    const newX = Math.max(initialWindowX - deltaX, 0);
    const newY = Math.max(initialWindowY - deltaY, 0);

    x.value = newX;
    y.value = newY;
  }

  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
    isBeingDragged.value = false;
    emit('endDrag', getFrameData(), event);
  }

  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);
};

const handleDiagonalResize = (event: MouseEvent) => {
  handleResize(event, 'diagonal');
};

const handleResize = (event: MouseEvent, direction: ResizeDirection) => {
  emit('startResize', { frameData: getFrameData(), resizeData: { direction } }, event);
  const initialMouseX = event.clientX;
  const initialMouseY = event.clientY;
  const initialContentHeight = contentHeight.value;
  const initialContentWidth = contentWidth.value;

  function mousemove(e: MouseEvent) {
    const deltaX = initialMouseX - e.clientX;
    const deltaY = initialMouseY - e.clientY;

    const newContentWidth = Math.max(initialContentWidth - deltaX, 50);
    const newContentHeight = initialContentHeight - deltaY;

    if (direction === 'vertical' || direction === 'diagonal')
      contentHeight.value = newContentHeight;
    if (direction === 'horizontal' || direction === 'diagonal')
      contentWidth.value = newContentWidth;
  }

  function mouseup() {
    window.removeEventListener('mousemove', mousemove);
    window.removeEventListener('mouseup', mouseup);
    emit('endResize', { frameData: getFrameData(), resizeData: { direction } }, event);
  }

  window.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);
};

const handleMinimize = (_: MouseEvent) => {
  visible.value = false;
};
</script>

<style scoped>
.ether-frame {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 25px #555;
  box-sizing: content-box;
  position: absolute;

  border: 2px solid #2e4f7a;
}
.ether-frame-titlebar {
  background-color: #4e6f9a;
  border-radius: 2px 2px 0 0;
  box-sizing: content-box;
  color: #f5f5dc;
  display: flex;
  flex-direction: row-reverse;
  overflow: clip;
  padding: 2px;
  user-select: none;
}
.ether-frame-content {
  box-sizing: content-box;
  margin: 0;
  overflow: clip;
  padding: 0;
}
.ether-frame-diagonal-resizer {
  cursor: nwse-resize;
  height: 8px;
  opacity: 0;
  position: absolute;
  right: 0;
  top: calc(100% - 8px);
  width: 8px;
}
.minimize-button {
  border: 2px solid white;
  border-radius: 2px;
  cursor: pointer;
  flex-basis: 1;
  font-weight: bolder;
  height: 15px;
  max-height: 80%;
  text-align: center;
  width: 15px;
}
.titlebar-title {
  flex: 1;
  overflow: hidden;
}
</style>
