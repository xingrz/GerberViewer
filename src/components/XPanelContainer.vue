<template>
  <div :ref="(ref) => container = ref as HTMLElement" class="x-panel-container">
    <a-tabs :class="{ [$style.collapsed]: collapsed }" type="card" @change="handleTabChange">
      <template #leftExtra>
        <div :style="{ marginRight: '10px' }">
          <a-button ghost @click="handleCollapse">
            <template #icon>
              <vertical-align-bottom-outlined v-if="collapsed" />
              <vertical-align-top-outlined v-else />
            </template>
          </a-button>
        </div>
      </template>
      <template #rightExtra>
        <slot name="extra" />
      </template>
      <slot />
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref, watch } from 'vue';
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue';

import { useClientSize } from '@/composables/useClientSize';

const emit = defineEmits<{
  (e: 'resize', height: number): void;
}>();

const collapsed = ref(false);

const container = ref<HTMLElement>();
const containerSize = useClientSize(container);
watch(containerSize, () => {
  emit('resize', containerSize.value!.height);
});

function handleCollapse() {
  collapsed.value = !collapsed.value;
}
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
        max-height: 50vh;
        overflow-y: scroll;
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

<style lang="scss" module>
.collapsed {

  :global(.ant-tabs-content-holder),
  :global(.ant-tabs-nav-list) {
    display: none !important;
  }

  :global(.ant-tabs-nav) {
    margin-bottom: 0;
  }

  :global(.ant-tabs-nav::before) {
    border-bottom: none;
  }
}
</style>
