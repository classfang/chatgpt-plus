<script setup lang="ts">
import ChatGPTBodyEmpty from '@renderer/components/body/ChatGPTBodyEmpty.vue'
import ChatGPTBodyHeader from '@renderer/components/body/ChatGPTBodyHeader.vue'
import ChatGPTBodyInput from '@renderer/components/body/ChatGPTBodyInput.vue'
import ChatGPTBodyMessageList from '@renderer/components/body/ChatGPTBodyMessageList.vue'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { ref } from 'vue'

// 仓库
const chatSessionStore = useChatSessionStore()

// ref
const bodyMessageListRef = ref()
const bodyInputRef = ref()
</script>

<template>
  <div class="chatgpt-body">
    <!-- 头部 -->
    <ChatGPTBodyHeader />
    <!-- 消息列表 -->
    <ChatGPTBodyMessageList
      v-if="chatSessionStore.getActiveSession!.messages.length > 0"
      ref="bodyMessageListRef"
      @regenerate="(messageId: string) => bodyInputRef.regenerate(messageId)"
    />
    <!-- 空状态 -->
    <ChatGPTBodyEmpty v-else @use-prompt="(prompt) => bodyInputRef.updateQuestion(prompt)" />
    <!-- 输入区域 -->
    <ChatGPTBodyInput
      ref="bodyInputRef"
      @send-question="bodyMessageListRef?.scrollToBottom(false)"
      @update-message="bodyMessageListRef?.scrollToBottom(true)"
    />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body {
  height: 100%;
  min-width: 0;
  flex: 1 1 0;
  background-color: var(--el-fill-color-extra-light);
  display: flex;
  flex-direction: column;
  gap: $app-padding-small;
}
</style>
