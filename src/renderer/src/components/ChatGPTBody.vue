<script setup lang="ts">
import { Edit, Expand } from '@element-plus/icons-vue'
import { useAppSettingStore } from '@renderer/store/app-setting'

// 仓库
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div class="chatgpt-body">
    <div class="body-header">
      <template v-if="!appSettingStore.chatgpt.sidebarVisible">
        <Expand
          class="sidebar-expand-icon"
          @click="appSettingStore.chatgpt.sidebarVisible = true"
        />
        <Edit class="session-create-icon" />
      </template>
    </div>
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

    .sidebar-expand-icon,
    .session-create-icon {
      height: 20px;
      width: 20px;
      flex-shrink: 0;
    }
  }
}
</style>
