<template>
  <div :class="$style.container" :ref="(ref) => containerRef = (ref as HTMLElement)">
    <canvas :ref="(ref) => canvasRef = (ref as HTMLCanvasElement)" />
  </div>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import stackup from 'pcb-stackup';
import { defineProps, reactive, ref, watch } from 'vue';

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

const scale = ref(1);
const scroll = reactive({ x: 0, y: 0 });

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

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.drawImage(
    image.value,
    -rect.width / 2 * scale.value + scroll.x,
    -rect.height / 2 * scale.value + scroll.y,
    rect.width * scale.value,
    rect.height * scale.value
  );
  ctx.restore();
}

window.addEventListener('resize', draw);
watch(image, () => {
  scale.value = 1;
  scroll.x = 0;
  scroll.y = 0;
  draw();
});

watch(canvasRef, () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    if (evt.ctrlKey) {
      const value = scale.value - evt.deltaY / 50;
      scale.value = Math.max(0.5, value);
    } else {
      scroll.x -= evt.deltaX;
      scroll.y -= evt.deltaY;
    }
    draw();
  });
});
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
