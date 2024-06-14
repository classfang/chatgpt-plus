<script setup lang="ts">
import ChatGPTBodyHeader from '@renderer/components/ChatGPTBodyHeader.vue'
import ChatGPTBodyInput from '@renderer/components/ChatGPTBodyInput.vue'
import ChatGPTBodyMessageList from '@renderer/components/ChatGPTBodyMessageList.vue'
import { ref } from 'vue'

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
      ref="bodyMessageListRef"
      @regenerate="(messageId: string) => bodyInputRef.regenerate(messageId)"
    />
    <!-- 输入区域 -->
    <ChatGPTBodyInput
      ref="bodyInputRef"
      @update-message="bodyMessageListRef.scrollToBottom(true)"
    />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body {
  height: 100%;
  min-width: 0;
  flex: 1 1 0;
  box-sizing: border-box;
  background-color: var(--el-fill-color-extra-light);
  display: flex;
  flex-direction: column;
  gap: $app-padding-small;
}
</style>
