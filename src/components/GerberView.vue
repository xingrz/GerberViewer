<template>
  <div :class="$style.container" :ref="(ref) => containerRef = (ref as HTMLElement)">
    <canvas :ref="(ref) => canvasRef = (ref as HTMLCanvasElement)" :class="{ [$style.dragging]: dragging }" />
  </div>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';

import stackup from 'pcb-stackup';
import { defineProps, reactive, ref, watch } from 'vue';

import { loadSvgImage } from '@/utils/svg';
import { scaleInside } from '@/utils/graphic';
import { COLORS, FINISHES } from '@/utils/gerber';

export type RenderSide = 'top' | 'bottom';
export type RenderSolderMask = keyof typeof COLORS;
export type RenderCopperFinish = keyof typeof FINISHES;

export interface RenderOptions {
  side: RenderSide;
  sm: RenderSolderMask;
  cf: RenderCopperFinish;
  sp: boolean;
}

const props = defineProps<{
  layers: InputLayer[];
  render: RenderOptions;
}>();

const image = ref<HTMLImageElement>();
watch(props, async () => {
  const [sm, ss] = COLORS[props.render.sm];
  const sp = props.render.sp ? FINISHES.tin : 'transparent';
  const cf = FINISHES[props.render.cf];

  const stack = await stackup(props.layers, {
    color: { sm, ss, sp, cf },
  });

  image.value = await loadSvgImage(stack[props.render.side].svg);
});

const containerRef = ref<HTMLElement>();
const canvasRef = ref<HTMLCanvasElement>();

const scale = ref(1);
const scroll = reactive({ x: 0, y: 0 });
const dragging = ref(false);

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

  canvas.addEventListener('mousedown', () => {
    dragging.value = true;
  });
  canvas.addEventListener('mouseup', () => {
    dragging.value = false;
  });
  canvas.addEventListener('mousemove', (evt) => {
    if (dragging.value) {
      evt.preventDefault();
      scroll.x += evt.movementX;
      scroll.y += evt.movementY;
      draw();
    }
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

.dragging {
  cursor: move;
}
</style>
