<template>
  <panel-unit title="输出选项">
    <a-form-item label="格式">
      <a-row :gutter="[8]">
        <a-col>
          <a-radio-group v-model:value="format">
            <a-radio-button value="svg">SVG</a-radio-button>
            <a-radio-button value="png">PNG</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="分层">
      <a-row :gutter="[8]">
        <a-col>
          <a-checkbox v-model:checked="splitLayers">
            输出分层文件
          </a-checkbox>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="浮雕">
      <a-row :gutter="[8]">
        <a-col>
          <a-checkbox v-model:checked="exportRelief">
            输出浮雕材质
          </a-checkbox>
          <a-tooltip placement="right" title="可用于 Fusion 360 等 3D 软件用作浮雕材质贴图">
            <info-circle-outlined />
          </a-tooltip>
        </a-col>
      </a-row>
    </a-form-item>
    <div>
      <a-button
        type="primary"
        :disabled="!props.gerber || props.layers.length == 0"
        :loading="rendering"
        @click="output">
        输出文件
      </a-button>
    </div>
  </panel-unit>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import stackup, { type InputLayer } from 'pcb-stackup';
import { render } from 'gerber-to-svg';

import PanelUnit from '@/components/XPanelUnit.vue';

import { renderStack, type RenderOptions } from '@/utils/gerber';
import { toPNG, toSVG } from '@/utils/svg';
import { outputZip } from '@/utils/zip';

const props = defineProps<{
  gerber: File | undefined;
  layers: InputLayer[];
  renderOptions: RenderOptions;
}>();

const format = ref<'svg' | 'png'>('svg');
const splitLayers = ref(false);
const exportRelief = ref(false);

const rendering = ref(false);
async function output(): Promise<void> {
  rendering.value = true;
  try {
    const stack = await renderStack(props.layers, props.renderOptions);

    const files: Record<string, Uint8Array> = {};

    const ext = format.value;
    const write = ext == 'png' ? toPNG : toSVG;

    files[`top.${ext}`] = await write(stack.top.svg);
    files[`bottom.${ext}`] = await write(stack.bottom.svg);

    if (splitLayers.value) {
      for (const layer of stack.layers) {
        files[`${layer.filename}.${ext}`] = await write(render(layer.converter, {}));
      }
    }

    if (exportRelief.value) {
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

      files['top-relief.png'] = await toPNG(reliefStack.top.svg, '#000000');
      files['bottom-relief.png'] = await toPNG(reliefStack.bottom.svg, '#000000');
    }

    await outputZip(files, `${basename(props.gerber!.name)}-img.zip`);
  } finally {
    rendering.value = false;
  }
}

function basename(name: string): string {
  return name.replace(/\..+$/, '');
}
</script>
