<template>
  <div :ref="(ref) => containerRef = (ref as HTMLElement)" :class="$style.container">
    <canvas :ref="(ref) => canvasRef = (ref as HTMLCanvasElement)" :class="{ [$style.dragging]: dragging }" />
  </div>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import type { IPosition, IScale } from '@/utils/graphic';

import { defineProps, reactive, ref, watch } from 'vue';

import { useWheelEvents } from '@/composables/useWheelEvents';
import { useMouseEvents } from '@/composables/useMouseEvents';
import { useClientSize } from '@/composables/useClientSize';

import { loadSvgImage } from '@/utils/svg';
import { centerOf, scaleInside, withIn } from '@/utils/graphic';
import { renderStack, type RenderOptions } from '@/utils/gerber';

const props = defineProps<{
  layers: InputLayer[];
  render: RenderOptions;
}>();

const image = ref<HTMLImageElement>();
watch(props, async () => {
  const stack = await renderStack(props.layers, props.render);
  image.value = await loadSvgImage(stack[props.render.side].svg);
});

const containerRef = ref<HTMLElement>();
const canvasRef = ref<HTMLCanvasElement>();

const container = useClientSize(containerRef);

const translate = reactive<IPosition & IScale>({
  x: 0, y: 0,
  scale: 0,
});

const dragging = ref(false);

watch([image, container, translate], () => {
  const canvas = canvasRef.value;
  if (!canvas || !container.value) return;
  canvas.width = container.value.width;
  canvas.height = container.value.height;

  if (!image.value) return;
  if (!image.value.width || !image.value.height) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = scaleInside(canvas, image.value);

  const canvasCenter = centerOf(canvas);
  const imageCenter = centerOf(rect);

  translate.scale = Math.min(5, Math.max(-2, translate.scale));
  const scale = Math.pow(2, translate.scale);

  translate.x = withIn(translate.x, canvasCenter.x + imageCenter.x * scale - 50);
  translate.y = withIn(translate.y, canvasCenter.y + imageCenter.y * scale - 50);

  ctx.save();
  ctx.translate(canvasCenter.x, canvasCenter.y);
  ctx.translate(translate.x, translate.y);
  ctx.scale(scale, scale);
  ctx.translate(-imageCenter.x, -imageCenter.y);
  ctx.drawImage(image.value, 0, 0, rect.width, rect.height);
  ctx.restore();
});

watch(image, () => {
  translate.scale = 0;
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
