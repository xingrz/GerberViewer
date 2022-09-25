<template>
  <img :src="image" :style="{ width:'100%' }" />
</template>

<script lang="ts" setup>
import { Buffer } from 'buffer';
import type { InputLayer } from 'pcb-stackup';
import stackup from 'pcb-stackup';
import { defineProps, ref, watch } from 'vue';

const props = defineProps<{
  layers: InputLayer[];
  side: 'top' | 'bottom';
}>();

const image = ref<string>();

watch(props, async () => {
  const stack = await stackup(props.layers);
  const svg = stack[props.side].svg;
  image.value = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
});
</script>
