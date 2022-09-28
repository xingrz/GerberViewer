<template>
  <panel-unit title="渲染">
    <a-form-item label="显示">
      <a-row type="flex" :gutter="[8]">
        <a-col>
          <a-radio-group :value="props.side" @update:value="(v: RenderSide) => emit('update:side', v)">
            <a-radio-button value="top">顶层</a-radio-button>
            <a-radio-button value="bottom">底层</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="阻焊">
      <a-row type="flex" :gutter="[8, 8]">
        <a-col>
          <a-select :value="props.sm" :style="{ width: '10em' }" @update:value="(v: RenderSolderMask) => emit('update:sm', v)">
            <a-select-option value="green">绿色</a-select-option>
            <a-select-option value="red">红色</a-select-option>
            <a-select-option value="yellow">黄色</a-select-option>
            <a-select-option value="blue">蓝色</a-select-option>
            <a-select-option value="white">白色</a-select-option>
            <a-select-option value="black">黑色</a-select-option>
            <a-select-option value="purple">紫色</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="裸铜">
      <a-row type="flex" :gutter="[8]">
        <a-col>
          <a-radio-group :value="props.cf" @update:value="(v: RenderCopperFinish) => emit('update:cf', v)">
            <a-radio-button value="tin">喷锡</a-radio-button>
            <a-radio-button value="gold">沉金</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item label="焊盘">
      <a-row type="flex" :gutter="[8]">
        <a-col>
          <a-checkbox :checked="props.sp" @update:checked="(v: boolean) => emit('update:sp', v)">
            绘制锡膏
          </a-checkbox>
        </a-col>
      </a-row>
    </a-form-item>
  </panel-unit>
</template>

<script lang="ts" setup>
import type {
  RenderCopperFinish,
  RenderSide,
  RenderSolderMask,
} from '@/components/GerberView.vue';

import { defineEmits, defineProps } from 'vue';

import PanelUnit from '@/components/XPanelUnit.vue';

const props = defineProps<{
  side: RenderSide;
  sm: RenderSolderMask;
  cf: RenderCopperFinish;
  sp: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:side', side: RenderSide): void;
  (e: 'update:sm', sm: RenderSolderMask): void;
  (e: 'update:cf', cf: RenderCopperFinish): void;
  (e: 'update:sp', sp: boolean): void;
}>();
</script>
