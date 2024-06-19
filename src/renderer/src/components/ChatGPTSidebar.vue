<script setup lang="ts">
import AppSetting from '@renderer/components/AppSetting.vue'
import ChatGPTSidebarHeader from '@renderer/components/ChatGPTSidebarHeader.vue'
import ChatGPTSidebarSessionList from '@renderer/components/ChatGPTSidebarSessionList.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { ref } from 'vue'

// 仓库
const appSettingStore = useAppSettingStore()

// ref
const sessionListRef = ref()
</script>

<template>
  <div
    class="chatgpt-sidebar"
    :class="{ 'chatgpt-sidebar-visible': appSettingStore.chatgpt.sidebarVisible }"
  >
    <!-- 头部 -->
    <ChatGPTSidebarHeader @create-session="sessionListRef.scrollToTop()" />

    <!-- 会话列表 -->
    <ChatGPTSidebarSessionList ref="sessionListRef" />

    <!-- 应用设置 -->
    <AppSetting />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-sidebar {
  height: 100%;
  width: 0;
  background-color: var(--el-fill-color-light);
  transition: width $app-transition-base;
  display: flex;
  flex-direction: column;

  &-visible {
    width: $app-chatgpt-sidebar-width;
  }
}
</style>
