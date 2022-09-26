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
          <a-button type="primary">
            <template #icon>
              <ExportOutlined />
            </template>
            导出
          </a-button>
        </a-col>
      </a-row>
    </template>
    <a-tab-pane key="file" tab="文件">
      <x-panel>
        <file-panel v-model:layers="layers" />
      </x-panel>
    </a-tab-pane>
  </x-panel-container>
  <gerber-view :layers="layers" side="top" :style="{ top: `${canvasTop}px` }" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ExportOutlined } from '@ant-design/icons-vue';
import type { InputLayer } from 'pcb-stackup';

import XPanelContainer from '@/components/XPanelContainer.vue';
import XPanel from '@/components/XPanel.vue';
import GerberView from '@/components/GerberView.vue';

import FilePanel from '@/panels/FilePanel.vue';

const layers = ref<InputLayer[]>([]);

const canvasTop = ref(0);
function handleResize(height: number): void {
  canvasTop.value = height;
}
</script>

<style lang="scss">
body {
  background: #283237;
}

.x-panel-container {
  background: #283237;
}

.ant-affix .x-panel-container {
  background: #485257;
}
</style>
