<template>
  <panel-unit :title="$t('layers_title')">
    <a-button :disabled="props.layers.length == 0" @click="showLayers">{{ $t('layers_open') }}</a-button>
  </panel-unit>
  <a-modal
    v-model:open="layersShown"
    :title="$t('layers_modal_title')"
    centered
    width="1000px">
    <a-row :gutter="[8, 8]">
      <template v-for="layer in editableLayers" :key="layer.filename!">
        <a-col :xs="24" :md="14" :lg="16">
          <span :class="$style.layerName">{{ layer.filename }}</span>
        </a-col>
        <a-col :xs="24" :md="10" :lg="8">
          <a-space>
            <a-select
              v-model:value="layer.type"
              :options="gerberTypes"
              :style="{ width: '10em' }"
              @change="guessLayerSide(layer)" />
            <a-radio-group v-if="hasSide(layer.type)" v-model:value="layer.side">
              <a-radio-button value="top">{{ $t('layers_side_top') }}</a-radio-button>
              <a-radio-button value="bottom">{{ $t('layers_side_bottom') }}</a-radio-button>
              <a-radio-button v-if="layer.type == 'copper'" value="inner">{{ $t('layers_side_inner') }}</a-radio-button>
            </a-radio-group>
          </a-space>
        </a-col>
      </template>
    </a-row>
    <template #footer>
      <a-button type="default" @click="restoreLayers">{{ $t('layers_restore') }}</a-button>
      <a-button type="default" @click="closeLayers">{{ $t('layers_close') }}</a-button>
      <a-button type="primary" @click="saveLayers">{{ $t('layers_confirm') }}</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import type { SelectProps } from 'ant-design-vue';
import type { GerberType } from 'whats-that-gerber';

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from 'lodash';

import PanelUnit from '@/components/XPanelUnit.vue';

import { mapLayerType } from '@/utils/gerber';

const { t } = useI18n();

const props = defineProps<{
  layers: InputLayer[];
}>();

const emit = defineEmits<{
  (e: 'update:layers', layers: InputLayer[]): void;
}>();

const editableLayers = ref<InputLayer[]>([]);
const layersShown = ref(false);

function showLayers(): void {
  editableLayers.value = cloneDeep(props.layers);
  layersShown.value = true;
}

function saveLayers(): void {
  emit('update:layers', editableLayers.value);
  layersShown.value = false;
}

function closeLayers(): void {
  layersShown.value = false;
}

function restoreLayers(): void {
  editableLayers.value = editableLayers.value.map((layer) => ({ ...layer, ...mapLayerType(layer.filename!) }));
}

const gerberTypes = computed<SelectProps['options']>(() => [
  { value: 'copper', label: t('type_copper') },
  { value: 'soldermask', label: t('type_soldermask') },
  { value: 'silkscreen', label: t('type_silkscreen') },
  { value: 'solderpaste', label: t('type_solderpaste') },
  { value: 'drill', label: t('type_drill') },
  { value: 'outline', label: t('type_outline') },
  { value: null, label: t('type_ignore') },
]);

function hasSide(type: GerberType | undefined): boolean {
  return !!type && ['copper', 'soldermask', 'silkscreen', 'solderpaste'].includes(type);
}

function guessLayerSide(layer: InputLayer): void {
  if (layer.type == 'outline') {
    layer.side = 'all';
  } else if (!layer.side) {
    const { side } = mapLayerType(layer.filename!);
    layer.side = side || 'top';
  }
}
</script>

<style lang="scss" module>
.layerName {
  font-family: monospace;
}
</style>
