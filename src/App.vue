<template>
  <x-panel-container @resize="handleResize">
    <template #extra>
      <a-row :gutter="[8]">
        <a-col>
          <a-button type="link" href="https://github.com/xingrz/GerberViewer" target="_blank">
            Fork me on GitHub
          </a-button>
        </a-col>
        <a-col>
          <a-upload
            :custom-request="loadGerber"
            :show-upload-list="false"
            accept=".zip,application/zip">
            <a-button type="primary" :loading="loading">打开 Gerber 文件</a-button>
          </a-upload>
        </a-col>
      </a-row>
    </template>
    <a-tab-pane key="options" tab="选项">
      <x-panel>
        <render-panel v-model:render="render" />
        <layers-panel v-model:layers="layers" />
      </x-panel>
    </a-tab-pane>
    <a-tab-pane key="output" tab="输出">
      <output-panel :gerber="gerber" :layers="layers" :render="render" />
    </a-tab-pane>
  </x-panel-container>
  <gerber-view :layers="layers" :render="render" :style="{ top: `${canvasTop}px` }" />
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import { ref } from 'vue';

import XPanelContainer from '@/components/XPanelContainer.vue';
import XPanel from '@/components/XPanel.vue';
import GerberView from '@/components/GerberView.vue';

import LayersPanel from '@/panels/LayersPanel.vue';
import RenderPanel from '@/panels/RenderPanel.vue';
import OutputPanel from '@/panels/OutputPanel.vue';

import { loadLayers, type RenderOptions } from '@/utils/gerber';

const gerber = ref<File>();

const layers = ref<InputLayer[]>([]);

const render = ref<RenderOptions>({
  side: 'top',
  sm: 'blue',
  cf: 'gold',
  sp: false,
});

const canvasTop = ref(0);
function handleResize(height: number): void {
  canvasTop.value = height;
}

const loading = ref(false);
async function loadGerber({ file }: { file: File }): Promise<void> {
  loading.value = true;
  gerber.value = file;
  layers.value = await loadLayers(file);
  loading.value = false;
}
</script>

<style lang="scss">
body,
.x-panel-container {
  background: #263238;
}
</style>
