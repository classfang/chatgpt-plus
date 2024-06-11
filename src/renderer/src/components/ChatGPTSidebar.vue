<script setup lang="ts">
import { Edit, Fold } from '@element-plus/icons-vue'
import { useAppSettingStore } from '@renderer/store/app-setting'

// 仓库
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div
    class="chatgpt-sidebar"
    :class="{ 'chatgpt-sidebar-visible': appSettingStore.chatgpt.sidebarVisible }"
  >
    <div class="sidebar-header">
      <template v-if="appSettingStore.chatgpt.sidebarVisible">
        <Fold class="sidebar-fold-icon" @click="appSettingStore.chatgpt.sidebarVisible = false" />
        <Edit class="session-create-icon" />
      </template>
    </div>
    <el-scrollbar class="session-list-scrollbar">
      <div class="session-list"></div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss">
.chatgpt-sidebar {
  height: 100%;
  width: 0;
  flex-shrink: 0;
  transition: width $app-transition-base;
  display: flex;
  flex-direction: column;

  .sidebar-header {
    height: 40px;
    width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sidebar-fold-icon,
    .session-create-icon {
      height: 20px;
      width: 20px;
      flex-shrink: 0;
    }
  }

  .session-list-scrollbar {
    height: calc(100% - 40px);
    width: 100%;

    .session-list {
      min-height: 0;
      flex-grow: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }
}

.chatgpt-sidebar-visible {
  width: 250px;
}
</style>
