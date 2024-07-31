<script setup lang="ts">
import AppSetting from '@renderer/components/setting/AppSetting.vue'
import AppState from '@renderer/components/state/AppState.vue'
import { ref } from 'vue'

// ref
const appSettingRef = ref()
</script>

<template>
  <div class="chatgpt-sidebar-footer-container" @click="appSettingRef?.openDialog()">
    <AppSetting ref="appSettingRef" @click.stop />
    <AppState />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-sidebar-footer-container {
  height: $app-chatgpt-sidebar-footer-height;
  width: 100%;
  box-sizing: border-box;
  padding: 0 $app-padding-base;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: color $app-transition-base;

  &:hover {
    color: var(--el-text-color-regular);
  }
}
</style>
