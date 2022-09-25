<template>
  <a-upload :customRequest="loadGerber" :showUploadList="false">
    <a-button type="primary" :loading="loading">打开 Gerber 文件</a-button>
  </a-upload>
</template>

<script lang="ts" setup>
import type { InputLayer } from 'pcb-stackup';
import { defineEmits, defineProps, ref } from 'vue';
import promisify from 'pify';
import { unzip as _unzip } from 'fflate';

import { readLayers } from '@/utils/gerber';

const unzip = promisify(_unzip);

defineProps<{
  layers: InputLayer[];
}>();

const emit = defineEmits<{
  (e: 'update:layers', layers: InputLayer[]): void;
}>();

const loading = ref(false);
async function loadGerber({ file }: { file: File }): Promise<void> {
  loading.value = true;

  const entries = await unzip(new Uint8Array(await file.arrayBuffer()));
  const layers = await readLayers(entries);
  emit('update:layers', layers);

  loading.value = false;
}
</script>
