<script setup lang="ts">
import ChatGPTBody from '@renderer/components/ChatGPTBody.vue'
import ChatGPTSidebar from '@renderer/components/ChatGPTSidebar.vue'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
</script>

<template>
  <div class="chatgpt">
    <ChatGPTSidebar />

    <transition name="el-fade-in-linear" mode="out-in">
      <ChatGPTBody
        v-if="chatSessionStore.getActiveSession"
        :key="chatSessionStore.getActiveSession.id"
      />
    </transition>
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
