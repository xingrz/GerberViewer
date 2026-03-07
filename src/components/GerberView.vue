<template>
  <div ref="container" :class="$style.container">
    <canvas ref="canvas" :class="{ [$style.dragging]: dragging }" />
  </div>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import type { IPosition, IScale } from '@/utils/graphic';

import { reactive, ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';

import { useWheelEvents } from '@/composables/useWheelEvents';
import { useMouseEvents } from '@/composables/useMouseEvents';
import { useClientSize } from '@/composables/useClientSize';

import { loadSvgImage } from '@/utils/svg';
import { centerOf, scaleInside, withIn } from '@/utils/graphic';
import { renderStack, type RenderOptions } from '@/utils/gerber';

const props = defineProps<{
  layers: InputLayer[];
  render: RenderOptions;
  panelHeight?: number;
}>();

const { t } = useI18n();

const image = ref<HTMLImageElement>();
let renderTaskId = 0;
watch(
  [
    () => props.layers,
    () => props.render.side,
    () => props.render.sm,
    () => props.render.cf,
    () => props.render.sp,
  ],
  async () => {
    const taskId = ++renderTaskId;

    try {
      const stack = await renderStack(props.layers, props.render);
      const svg = stack[props.render.side]?.svg;
      image.value = svg ? await loadSvgImage(svg) : undefined;
    } catch (error) {
      if (taskId != renderTaskId) return;
      image.value = undefined;
      console.error('Failed to render Gerber layers.', error);
      message.error(t('render_error'));
    }
  },
  { immediate: true },
);

const containerRef = useTemplateRef<HTMLElement>('container');
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas');

const container = useClientSize(containerRef);

const translate = reactive<IPosition & IScale>({
  x: 0, y: 0,
  scale: 0,
});

const dragging = ref(false);

watch([image, container, translate, () => props.panelHeight], () => {
  const canvas = canvasRef.value;
  if (!canvas || !container.value) return;
  canvas.width = container.value.width;
  canvas.height = container.value.height;

  if (!image.value) return;
  if (!image.value.width || !image.value.height) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const panelOffset = props.panelHeight ?? 0;
  const visibleArea = { width: canvas.width, height: canvas.height - panelOffset };
  const rect = scaleInside(visibleArea, image.value);

  const visibleCenter = centerOf(visibleArea);
  const canvasCenter = { x: visibleCenter.x, y: visibleCenter.y + panelOffset };
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

watch(() => props.layers, () => {
  translate.scale = 0;
  translate.x = 0;
  translate.y = 0;
});

useWheelEvents(canvasRef, translate);
useMouseEvents(canvasRef, translate, dragging);
</script>

<style lang="scss" module>
.container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #1a2327;
}

.dragging {
  cursor: move;
}
</style>
