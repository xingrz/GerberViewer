<template>
  <div :class="$style.container" :ref="(ref) => containerRef = (ref as HTMLElement)">
    <canvas :ref="(ref) => canvasRef = (ref as HTMLCanvasElement)" />
  </div>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import stackup from 'pcb-stackup';
import { defineProps, ref, watch } from 'vue';

import { loadSvgImage } from '@/utils/svg';
import { scaleInside } from '@/utils/graphic';

const props = defineProps<{
  layers: InputLayer[];
  side: 'top' | 'bottom';
}>();

const image = ref<HTMLImageElement>();
watch(props, async () => {
  const stack = await stackup(props.layers);
  image.value = await loadSvgImage(stack[props.side].svg);
});

const containerRef = ref<HTMLElement>();
const canvasRef = ref<HTMLCanvasElement>();

function draw(): void {
  const container = containerRef.value;
  const canvas = canvasRef.value;
  if (!container || !canvas) return;
  if (!image.value) return;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = scaleInside(canvas, image.value);
  ctx.drawImage(image.value, rect.x, rect.y, rect.width, rect.height);
}

window.addEventListener('resize', draw);
watch(image, draw);
</script>

<style lang="scss" module>
.container {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  overflow: hidden;
}
</style>
