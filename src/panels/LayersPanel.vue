<template>
  <panel-unit title="图层">
    <a-button @click="showLayers" :disabled="props.layers.length == 0">打开图层设置</a-button>
  </panel-unit>
  <a-modal v-model:visible="layersShown" title="图层设置" centered width="1000px">
    <a-row type="flex" :gutter="[8, 8]">
      <template v-for="layer in layers" :key="layer.filename!">
        <a-col :xs="24" :md="14" :lg="16">
          <span :class="$style.layerName">{{layer.filename}}</span>
        </a-col>
        <a-col :xs="24" :md="10" :lg="8">
          <a-space>
            <a-select v-model:value="layer.type" :options="gerberTypes" :style="{ width: '6em' }"
              @change="guessLayerSide(layer)" />
            <a-radio-group v-model:value="layer.side" v-if="hasSide(layer.type)">
              <a-radio-button value="top">顶层</a-radio-button>
              <a-radio-button value="bottom">底层</a-radio-button>
              <a-radio-button value="inner" v-if="layer.type == 'copper'">内层</a-radio-button>
            </a-radio-group>
          </a-space>
        </a-col>
      </template>
    </a-row>
    <template #footer>
      <a-button type="default" @click="restoreLayers">恢复默认</a-button>
      <a-button type="default" @click="closeLayers">关闭</a-button>
      <a-button type="primary" @click="saveLayers">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import type { SelectProps } from 'ant-design-vue';
import type { GerberType } from 'whats-that-gerber';

import { defineEmits, defineProps, ref } from 'vue';
import { cloneDeep } from 'lodash';

import PanelUnit from '@/components/XPanelUnit.vue';

import { mapLayerType } from '@/utils/gerber';

const props = defineProps<{
  layers: InputLayer[];
}>();

const emit = defineEmits<{
  (e: 'update:layers', layers: InputLayer[]): void;
}>();

const layers = ref<InputLayer[]>([]);
const layersShown = ref(false);

function showLayers(): void {
  layers.value = cloneDeep(props.layers);
  layersShown.value = true;
}

function saveLayers(): void {
  emit('update:layers', layers.value);
  layersShown.value = false;
}

function closeLayers(): void {
  layersShown.value = false;
}

function restoreLayers(): void {
  layers.value = layers.value.map((layer) => ({ ...layer, ...mapLayerType(layer.filename!) }));
}

const gerberTypes: SelectProps['options'] = [
  { value: 'copper', label: '线路' },
  { value: 'soldermask', label: '阻焊' },
  { value: 'silkscreen', label: '丝印' },
  { value: 'solderpaste', label: '钢网' },
  { value: 'drill', label: '钻孔' },
  { value: 'outline', label: '轮廓' },
  { value: null, label: '忽略' },
];

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
