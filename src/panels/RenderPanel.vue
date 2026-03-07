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
            <a-select-option value="green">{{ $t('color_green') }}</a-select-option>
            <a-select-option value="red">{{ $t('color_red') }}</a-select-option>
            <a-select-option value="yellow">{{ $t('color_yellow') }}</a-select-option>
            <a-select-option value="blue">{{ $t('color_blue') }}</a-select-option>
            <a-select-option value="white">{{ $t('color_white') }}</a-select-option>
            <a-select-option value="black">{{ $t('color_black') }}</a-select-option>
            <a-select-option value="purple">{{ $t('color_purple') }}</a-select-option>
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
import type { RenderOptions } from '@/utils/gerber';
import { reactive } from 'vue';

import PanelUnit from '@/components/XPanelUnit.vue';

const props = defineProps<{
  render: RenderOptions;
}>();

const render = reactive(props.render);
</script>
