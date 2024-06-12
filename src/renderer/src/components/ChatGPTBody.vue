<script setup lang="ts">
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
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
    height: $app-chatgpt-body-header-height;
    width: 100%;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: 0 $app-padding-base;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $app-padding-base;
  }
}
</style>
