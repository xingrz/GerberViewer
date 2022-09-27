<template>
  <div :class="$style.container" :ref="(ref) => containerRef = (ref as HTMLElement)">
    <canvas :ref="(ref) => canvasRef = (ref as HTMLCanvasElement)" :class="{ [$style.dragging]: dragging }" />
  </div>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import type { IPosition, IScale } from '@/utils/graphic';

import stackup from 'pcb-stackup';
import { defineProps, reactive, ref, watch } from 'vue';

import { useWheelEvents } from '@/composables/useWheelEvents';
import { useMouseEvents } from '@/composables/useMouseEvents';
import { useClientSize } from '@/composables/useClientSize';

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

const container = useClientSize(containerRef);

const translate = reactive<IPosition & IScale>({
  x: 0, y: 0,
  scale: 1,
});

const dragging = ref(false);

watch([image, container, translate], () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  if (!image.value || !container.value) return;

  canvas.width = container.value.width;
  canvas.height = container.value.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = scaleInside(canvas, image.value);
  const scale = Math.max(0.5, translate.scale);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.drawImage(
    image.value,
    -rect.width / 2 * scale + translate.x,
    -rect.height / 2 * scale + translate.y,
    rect.width * scale,
    rect.height * scale
  );
  ctx.restore();
});

watch(image, () => {
  translate.scale = 1;
  translate.x = 0;
  translate.y = 0;
});

useWheelEvents(canvasRef, translate);
useMouseEvents(canvasRef, translate, dragging);
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
