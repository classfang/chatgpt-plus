<script setup lang="ts">
import ChatGPTBody from '@renderer/components/body/ChatGPTBody.vue'
import ChatGPTSidebar from '@renderer/components/sidebar/ChatGPTSidebar.vue'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
</script>

<template>
  <div class="chatgpt">
    <ChatGPTSidebar />

    <ChatGPTBody
      v-if="chatSessionStore.getActiveSession"
      :key="chatSessionStore.getActiveSession.id"
    />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt {
  min-height: 0;
  width: 100%;
  flex: 1 1 0;
  display: flex;
}
</style>
