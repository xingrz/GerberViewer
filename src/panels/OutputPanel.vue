<template>
  <panel-unit :title="$t('output_title')">
    <a-form-item :label="$t('output_format')">
      <a-row :gutter="[8]">
        <a-col>
          <a-radio-group v-model:value="format">
            <a-radio-button value="svg">SVG</a-radio-button>
            <a-radio-button value="png">PNG</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item :label="$t('output_split')">
      <a-row :gutter="[8]">
        <a-col>
          <a-checkbox v-model:checked="splitLayers">
            {{ $t('output_split_desc') }}
          </a-checkbox>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item :label="$t('output_relief')">
      <a-row :gutter="[8]">
        <a-col>
          <a-checkbox v-model:checked="exportRelief">
            {{ $t('output_relief_desc') }}
          </a-checkbox>
          <a-tooltip placement="right" :title="$t('output_relief_tip')">
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
        {{ $t('output_btn') }}
      </a-button>
    </div>
  </panel-unit>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
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

const { t } = useI18n();

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
  } catch (error) {
    console.error('Failed to export.', error);
    message.error(t('output_error'));
  } finally {
    rendering.value = false;
  }
}

function basename(name: string): string {
  return name.replace(/\..+$/, '');
}
</script>
