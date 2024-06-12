<script setup lang="ts">
import ChatGPTSidebarHeader from '@renderer/components/ChatGPTSidebarHeader.vue'
import ChatGPTSidebarSessionList from '@renderer/components/ChatGPTSidebarSessionList.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'

// 仓库
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div
    class="chatgpt-sidebar"
    :class="{ 'chatgpt-sidebar-visible': appSettingStore.chatgpt.sidebarVisible }"
  >
    <!-- 头部 -->
    <ChatGPTSidebarHeader />

    <!-- 会话列表 -->
    <ChatGPTSidebarSessionList />
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
}

.chatgpt-sidebar-visible {
  width: $app-chatgpt-sidebar-width;
}
</style>
