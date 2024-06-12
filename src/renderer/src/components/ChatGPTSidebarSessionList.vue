<script setup lang="ts">
import ChatGPTSidebarSession from '@renderer/components/ChatGPTSidebarSession.vue'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
</script>

<template>
  <el-scrollbar class="chatgpt-session-list-scrollbar">
    <div class="session-list">
      <template v-for="s in chatSessionStore.sessions" :key="s.id">
        <ChatGPTSidebarSession :session="s" />
      </template>
    </div>
  </el-scrollbar>
</template>

<style lang="scss">
.chatgpt-session-list-scrollbar {
  height: calc(100% - $app-chatgpt-sidebar-header-height);
  width: 100%;

  .session-list {
    min-height: 0;
    flex: 1 1 0;
    width: 100%;
    box-sizing: border-box;
    padding: $app-padding-base $app-padding-base 0 $app-padding-base;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $app-padding-base;
  }
}
</style>
