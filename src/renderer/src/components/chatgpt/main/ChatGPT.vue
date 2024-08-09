<script setup lang="ts">
import ChatGPTBody from '@renderer/components/chatgpt/body/ChatGPTBody.vue'
import ChatGPTSidebar from '@renderer/components/chatgpt/sidebar/ChatGPTSidebar.vue'
import { useStore } from '@renderer/store/store'

// 仓库
const { chatSessionStore } = useStore()
</script>

<template>
  <div class="chatgpt">
    <!-- 侧边栏 -->
    <ChatGPTSidebar />

    <!-- 主体 -->
    <ChatGPTBody
      v-if="chatSessionStore.getActiveSession"
      :key="chatSessionStore.getActiveSession.id"
    />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>
