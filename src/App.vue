<template>
  <x-panel-container>
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
    <a-tab-pane key="panel1" tab="Panel 1">
      <x-panel>
        Panel 1
      </x-panel>
    </a-tab-pane>
    <a-tab-pane key="panel2" tab="Panel 2">
      <x-panel>
        Panel 2
      </x-panel>
    </a-tab-pane>
  </x-panel-container>
  <div :style="{width:'5000px', height:'2000px'}">
    Hello world
  </div>
</template>

<script lang="ts" setup>
import { ExportOutlined } from '@ant-design/icons-vue';

import XPanelContainer from '@/components/XPanelContainer.vue';
import XPanel from '@/components/XPanel.vue';
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
