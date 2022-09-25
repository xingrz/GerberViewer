<template>
  <a-col :span="12">
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
      <h4 v-if="props.title">{{ props.title }}</h4>
      <slot />
    </a-form>
  </a-col>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  title?: string;
}>();

const labelCol = {
  style: {
    width: '60px',
    textAlign: 'left',
  },
};

const wrapperCol = {
  span: 24,
  style: {
    maxWidth: '400px',
  },
};
</script>
