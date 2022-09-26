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
    <a-form-item label="浮雕">
      <a-row type="flex" :gutter="[8]">
        <a-col>
          <a-checkbox v-model:checked="relief">
            输出浮雕材质
          </a-checkbox>
          <a-tooltip placement="right" title="可用于 Fusion 360 等 3D 软件用作浮雕材质贴图">
            <info-circle-outlined />
          </a-tooltip>
        </a-col>
      </a-row>
    </a-form-item>
    <div>
      <a-button type="primary" :disabled="props.layers.length == 0" :loading="rendering" @click="output">输出文件</a-button>
    </div>
  </panel-unit>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import type { RenderOptions } from '@/components/GerberView.vue';

import { defineProps, ref } from 'vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import stackup from 'pcb-stackup';
import { render } from 'gerber-to-svg';

import PanelUnit from '@/components/XPanelUnit.vue';

import { COLORS, FINISHES } from '@/utils/gerber';
import { toPNG, toSVG } from '@/utils/svg';
import { outputZip } from '@/utils/zip';

const props = defineProps<{
  layers: InputLayer[];
  render: RenderOptions;
}>();

const format = ref<'svg' | 'png'>('svg');
const layers = ref(false);
const relief = ref(false);

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

  const ext = format.value;
  const write = ext == 'png' ? toPNG : toSVG;

  files[`top.${ext}`] = await write(stack.top.svg);
  files[`bottom.${ext}`] = await write(stack.bottom.svg);

  if (layers.value) {
    for (const layer of stack.layers) {
      files[`${layer.filename}.${ext}`] = await write(render(layer.converter, {}));
    }
  }

  if (relief.value) {
    const reliefStack = await stackup(props.layers, {
      color: {
        fr4: 'transparent',
        cu: '#ffffff',
        cf: 'transparent',
        sm: 'transparent',
        ss: 'transparent',
        sp: 'transparent',
        out: 'transparent',
      },
    });

    files[`top-relief.png`] = await toPNG(reliefStack.top.svg, '#000000');
    files[`bottom-relief.png`] = await toPNG(reliefStack.bottom.svg, '#000000');
  }

  await outputZip(files, 'pcb.zip');

  rendering.value = false;
}
</script>
