<template>
  <x-panel-container @resize="handleResize">
    <template #extra>
      <a-row :gutter="[8]" align="middle">
        <a-col>
          <a-button type="link" href="https://github.com/xingrz/GerberViewer" target="_blank">
            Fork me on GitHub
          </a-button>
        </a-col>
        <a-col>
          <a-dropdown :trigger="['click']">
            <a-button ghost size="small">{{ localeLabel }}</a-button>
            <template #overlay>
              <a-menu
                :selected-keys="[locale]"
                @click="({ key }: { key: string }) => locale = key">
                <a-menu-item
                  v-for="item in locales"
                  :key="item.value">
                  {{ item.label }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-col>
        <a-col>
          <a-upload
            :custom-request="loadGerber"
            :show-upload-list="false"
            accept=".zip,application/zip">
            <a-button type="primary" :loading="loading">{{ $t('open_gerber') }}</a-button>
          </a-upload>
        </a-col>
      </a-row>
    </template>
    <a-tab-pane key="options" :tab="$t('tab_options')">
      <x-panel>
        <render-panel v-model:render="render" />
        <layers-panel v-model:layers="layers" />
      </x-panel>
    </a-tab-pane>
    <a-tab-pane key="output" :tab="$t('tab_output')">
      <output-panel :gerber="gerber" :layers="layers" :render-options="render" />
    </a-tab-pane>
  </x-panel-container>
  <gerber-view :layers="layers" :render="render" :style="{ top: `${canvasTop}px` }" />
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import XPanelContainer from '@/components/XPanelContainer.vue';
import XPanel from '@/components/XPanel.vue';
import GerberView from '@/components/GerberView.vue';

import LayersPanel from '@/panels/LayersPanel.vue';
import RenderPanel from '@/panels/RenderPanel.vue';
import OutputPanel from '@/panels/OutputPanel.vue';

import { loadLayers, type RenderOptions } from '@/utils/gerber';
import { locales } from '@/i18n';

const { locale } = useI18n();
const localeLabel = computed(() => locales.find((l) => l.value === locale.value)?.label);

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
  try {
    gerber.value = file;
    layers.value = await loadLayers(file);
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss">
html,
body {
  overscroll-behavior-x: none;
}

body,
.x-panel-container {
  background: #263238;
}
</style>
