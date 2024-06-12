<script setup lang="ts">
import ChatGPTMessageAssistant from '@renderer/components/ChatGPTMessageAssistant.vue'
import ChatGPTMessageUser from '@renderer/components/ChatGPTMessageUser.vue'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
</script>

<template>
  <div class="chatgpt-body-message-list">
    <template v-for="m in chatSessionStore.getActiveSession!.messages" :key="m.id">
      <!-- 对话消息 -->
      <template v-if="m.type === 'chat'">
        <template v-if="m.role === 'user'">
          <ChatGPTMessageUser :message="m" />
        </template>
        <template v-else-if="m.role === 'assistant'">
          <ChatGPTMessageAssistant :message="m" />
        </template>
      </template>

      <!-- 错误消息 -->
      <template v-else-if="m.type === 'error'"> </template>

      <!-- 分隔消息 -->
      <template v-else-if="m.type === 'separator'"> </template>
    </template>
  </div>
</template>

<style lang="scss">
.chatgpt-body-message-list {
  min-height: 0;
  width: 100%;
  flex: 1 1 0;
  box-sizing: border-box;
  padding: $app-padding-base;
  display: flex;
  flex-direction: column;
  gap: $app-padding-base;
}
</style>
