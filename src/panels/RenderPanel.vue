<template>
  <panel-unit :title="$t('render_title')">
    <a-form-item :label="$t('render_side')">
      <a-row :gutter="[8]">
        <a-col>
          <a-radio-group v-model:value="render.side">
            <a-radio-button value="top">{{ $t('render_side_top') }}</a-radio-button>
            <a-radio-button value="bottom">{{ $t('render_side_bottom') }}</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item :label="$t('render_sm')">
      <a-row :gutter="[8, 8]">
        <a-col>
          <a-select v-model:value="render.sm" :style="{ width: '10em' }">
            <a-select-option v-for="(color, key) in COLORS" :key="key" :value="key">
              <span :class="$style.colorSwatch" :style="{ background: color[0] }" />
              {{ $t(`color_${key}`) }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item :label="$t('render_cf')">
      <a-row :gutter="[8]">
        <a-col>
          <a-radio-group v-model:value="render.cf">
            <a-radio-button value="tin">{{ $t('render_cf_tin') }}</a-radio-button>
            <a-radio-button value="gold">{{ $t('render_cf_gold') }}</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item :label="$t('render_sp')">
      <a-row :gutter="[8]">
        <a-col>
          <a-checkbox v-model:checked="render.sp">
            {{ $t('render_sp_draw') }}
          </a-checkbox>
        </a-col>
      </a-row>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import { COLORS, type RenderOptions } from '@/utils/gerber';
import { reactive } from 'vue';

import PanelUnit from '@/components/XPanelUnit.vue';

const props = defineProps<{
  render: RenderOptions;
}>();

const render = reactive(props.render);
</script>

<style lang="scss" module>
.colorSwatch {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  vertical-align: middle;
  margin-right: 6px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
