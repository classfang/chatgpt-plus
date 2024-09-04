<script setup lang="ts">
import ChatGPTSidebarFooter from '@renderer/components/chatgpt/sidebar/ChatGPTSidebarFooter.vue'
import ChatGPTSidebarHeader from '@renderer/components/chatgpt/sidebar/ChatGPTSidebarHeader.vue'
import ChatGPTSidebarMenu from '@renderer/components/chatgpt/sidebar/ChatGPTSidebarMenu.vue'
import ChatGPTSidebarSessionList from '@renderer/components/chatgpt/sidebar/ChatGPTSidebarSessionList.vue'
import { useStore } from '@renderer/store/store'
import { ref } from 'vue'

// 仓库
const { appSettingStore } = useStore()

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

    <!-- 菜单按钮区 -->
    <ChatGPTSidebarMenu />

    <div class="sidebar-divider">
      <el-divider />
    </div>

    <!-- 会话列表 -->
    <ChatGPTSidebarSessionList ref="sessionListRef" />

    <!-- 底部 -->
    <ChatGPTSidebarFooter />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-sidebar {
  height: 100%;
  width: 0;
  overflow: hidden;
  background-color: var(--el-fill-color-light);
  transition: width $app-transition-base;
  display: flex;
  flex-direction: column;
  gap: $app-padding-small;

  &-visible {
    width: $app-chatgpt-sidebar-width;
  }

  .sidebar-divider {
    box-sizing: border-box;
    padding: $app-padding-extra-small $app-padding-base;

    .el-divider {
      margin: 0;
    }
  }
}
</style>
