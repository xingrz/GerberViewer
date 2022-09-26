<template>
  <div class="x-panel-container" :ref="(ref) => container = ref as Element">
    <a-tabs type="card" @change="handleTabChange">
      <template #rightExtra>
        <slot name="extra" />
      </template>
      <slot />
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, nextTick, ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'resize', height: number): void;
}>();

const container = ref<Element>();
function handleTabChange(): void {
  nextTick(() => {
    if (container.value) {
      emit('resize', container.value.clientHeight);
    }
  });
}
watch(container, handleTabChange);
</script>

<style lang="scss">
.x-panel-container {
  padding: 8px;
  background: #283237;
  transition: background 250ms;

  >.ant-tabs-card {
    .ant-tabs-content {
      margin-top: -16px;

      >.ant-tabs-tabpane {
        padding: 32px;
        background: #fff;
      }
    }

    .ant-tabs-tab {
      background: transparent;
      border: none;
      padding-bottom: 12px;

      >.ant-tabs-tab-btn {
        color: white;
      }
    }

    .ant-tabs-extra-content {
      align-self: flex-start;
    }

    .ant-tabs-tab-active {
      background: #fff;

      >.ant-tabs-tab-btn {
        color: black;
      }
    }
  }

  .ant-form-item {
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
</style>
