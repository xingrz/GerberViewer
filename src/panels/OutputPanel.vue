<template>
  <panel-unit title="输出选项">
    <a-form-item label="格式">
      <a-row type="flex" :gutter="[8]">
        <a-col>
          <a-radio-group v-model:value="format">
            <a-radio-button value="svg">SVG</a-radio-button>
            <a-radio-button value="png">PNG</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="分层">
      <a-row type="flex" :gutter="[8]">
        <a-col>
          <a-checkbox v-model:checked="layers">
            输出分层文件
          </a-checkbox>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 4 }">
      <a-button type="primary" :disabled="props.layers.length == 0" :loading="rendering" @click="output">输出文件</a-button>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import type { RenderOptions } from '@/components/GerberView.vue';

import { defineProps, ref } from 'vue';
import stackup from 'pcb-stackup';
import { render } from 'gerber-to-svg';

import PanelUnit from '@/components/XPanelUnit.vue';

import { COLORS, FINISHES } from '@/utils/gerber';
import { outputZip } from '@/utils/zip';

const props = defineProps<{
  layers: InputLayer[];
  render: RenderOptions;
}>();

const format = ref<'svg' | 'png'>('svg');
const layers = ref(false);

const rendering = ref(false);
async function output(): Promise<void> {
  rendering.value = true;

  const [sm, ss] = COLORS[props.render.sm];
  const sp = props.render.sp ? FINISHES.tin : 'transparent';
  const cf = FINISHES[props.render.cf];
  const stack = await stackup(props.layers, {
    color: { sm, ss, sp, cf },
  });

  const files: Record<string, Uint8Array> = {};

  files['top.svg'] = renderSVG(stack.top.svg);
  files['bottom.svg'] = renderSVG(stack.bottom.svg);

  if (props.layers) {
    for (const layer of stack.layers) {
      files[`${layer.filename}.svg`] = renderSVG(render(layer.converter, {}));
    }
  }

  await outputZip(files, 'pcb.zip');

  rendering.value = false;
}

function renderSVG(svg: string): Uint8Array {
  return new TextEncoder().encode(svg);
}
</script>
