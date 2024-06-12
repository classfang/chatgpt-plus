<script setup lang="ts">
import { useAppSettingStore } from '@renderer/store/app-setting'

// 仓库
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div class="chatgpt-body">
    <div class="body-header"></div>
  </div>
</template>

<style lang="scss">
.chatgpt-body {
  height: 100%;
  min-width: 0;
  background-color: var(--el-fill-color-lighter);
  flex-grow: 1;
  flex-direction: column;

  .body-header {
    height: 40px;
    width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
  }
}
</style>
