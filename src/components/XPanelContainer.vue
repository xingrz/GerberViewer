<template>
  <a-affix :ref="(ref) => navAffix = ref as AffixInstance">
    <div class="x-panel-container">
      <a-tabs type="card">
        <template #rightExtra>
          <slot name="extra" />
        </template>
        <slot />
      </a-tabs>
    </div>
  </a-affix>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { AffixInstance } from 'ant-design-vue/lib/affix';

const navAffix = ref<AffixInstance>();
window.addEventListener('resize', () => {
  navAffix.value?.updatePosition();
});
</script>

<style lang="scss">
.x-panel-container {
  position: fixed;
  left: 0;
  right: 0;
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

.ant-affix .x-panel-container {
  box-shadow: rgba(0, 0, 0, 1.0) 0px 0px 4px;
  background: #485257;
}
</style>
