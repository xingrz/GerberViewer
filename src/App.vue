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
          <a-upload :customRequest="loadGerber" :showUploadList="false">
            <a-button type="primary" :loading="loading">打开 Gerber 文件</a-button>
          </a-upload>
        </a-col>
      </a-row>
    </template>
    <a-tab-pane key="layers" tab="图层">
      <x-panel>
        <layers-panel v-model:layers="layers" />
      </x-panel>
    </a-tab-pane>
  </x-panel-container>
  <gerber-view :layers="layers" side="top" :style="{ top: `${canvasTop}px` }" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { InputLayer } from 'pcb-stackup';

import XPanelContainer from '@/components/XPanelContainer.vue';
import XPanel from '@/components/XPanel.vue';
import GerberView from '@/components/GerberView.vue';

import LayersPanel from '@/panels/LayersPanel.vue';

import { loadLayers } from '@/utils/gerber';

const layers = ref<InputLayer[]>([]);

const canvasTop = ref(0);
function handleResize(height: number): void {
  canvasTop.value = height;
}

const loading = ref(false);
async function loadGerber({ file }: { file: File }): Promise<void> {
  loading.value = true;
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
