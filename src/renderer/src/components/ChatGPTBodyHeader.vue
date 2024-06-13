<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div
    class="chatgpt-body-header"
    :class="{
      'chatgpt-body-header-sidebar-header-placeholder': !appSettingStore.chatgpt.sidebarVisible
    }"
  >
    <!-- 模型名称下拉列表 -->
    <el-dropdown trigger="click">
      <div class="model-name">
        <div>{{ chatSessionStore.getActiveSession!.model }}</div>
        <ArrowDown class="session-setting-icon" />
      </div>
      <template #dropdown>
        <div class="model-dropdown-body"></div>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-header {
  height: $app-chatgpt-body-header-height;
  width: 100%;
  box-sizing: border-box;
  padding: 0 $app-padding-base;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: $app-padding-base;

  &-sidebar-header-placeholder {
    padding-left: calc($app-icon-size-base * 2 + $app-padding-base * 3);
  }

  .model-name {
    display: flex;
    gap: $app-padding-small;
    align-items: center;
    justify-content: center;
    font-size: $app-icon-size-small;
    font-weight: var(--el-font-weight-primary);
    cursor: pointer;

    .session-setting-icon {
      height: $app-icon-size-small;
      width: $app-icon-size-small;
    }
  }
}

.model-dropdown-body {
  width: $app-chatgpt-body-header-model-dropdown-body-width;
}
</style>
