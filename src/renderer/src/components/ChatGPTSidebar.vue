<script setup lang="ts">
import { Edit, Expand, Fold } from '@element-plus/icons-vue'
import { useAppSettingStore } from '@renderer/store/app-setting'

// 仓库
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div
    class="chatgpt-sidebar"
    :class="{ 'chatgpt-sidebar-visible': appSettingStore.chatgpt.sidebarVisible }"
  >
    <div class="sidebar-header-container">
      <div
        class="sidebar-header"
        :class="{ 'sidebar-header-visible': appSettingStore.chatgpt.sidebarVisible }"
      >
        <Fold
          v-if="appSettingStore.chatgpt.sidebarVisible"
          class="sidebar-fold-icon"
          @click="appSettingStore.chatgpt.sidebarVisible = false"
        />
        <Expand
          v-else
          class="sidebar-expand-icon"
          @click="appSettingStore.chatgpt.sidebarVisible = true"
        />
        <Edit class="session-create-icon" />
      </div>
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
  background-color: var(--el-fill-color-light);
  transition: width $app-transition-base;
  display: flex;
  flex-direction: column;

  .sidebar-header-container {
    height: $app-chatgpt-sidebar-header-height;
    width: 100%;
    flex-shrink: 0;

    .sidebar-header {
      height: $app-chatgpt-sidebar-header-height;
      width: calc($app-icon-size-base * 2 + $app-padding-base * 3);
      transition: width $app-transition-base;
      box-sizing: border-box;
      padding: 0 $app-padding-base;
      position: absolute;
      top: $app-header-height;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .sidebar-fold-icon,
      .sidebar-expand-icon,
      .session-create-icon {
        height: $app-icon-size-base;
        width: $app-icon-size-base;
        flex-shrink: 0;
      }
    }

    .sidebar-header-visible {
      width: $app-chatgpt-sidebar-width;
    }
  }

  .session-list-scrollbar {
    height: calc(100% - $app-chatgpt-sidebar-header-height);
    width: 100%;

    .session-list {
      min-height: 0;
      flex-grow: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $app-padding-base;
    }
  }
}

.chatgpt-sidebar-visible {
  width: $app-chatgpt-sidebar-width;
}
</style>
