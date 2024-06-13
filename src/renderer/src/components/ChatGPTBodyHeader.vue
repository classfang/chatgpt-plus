<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
</script>

<template>
  <div class="chatgpt-body-header">
    <div class="model-name">
      <div>{{ chatSessionStore.getActiveSession!.model }}</div>
      <Setting class="session-setting-icon" />
    </div>
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

  .model-name {
    font-size: var(--el-font-size-large);
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;

    .session-setting-icon {
      height: $app-icon-size-base;
      width: $app-icon-size-base;
    }
  }
}
</style>
