<script setup lang="ts">
import ChatGPTBodyHeader from '@renderer/components/ChatGPTBodyHeader.vue'
import ChatGPTBodyInput from '@renderer/components/ChatGPTBodyInput.vue'
import ChatGPTBodyMessageList from '@renderer/components/ChatGPTBodyMessageList.vue'
import { ref } from 'vue'

// ref
const bodyMessageListRef = ref()
</script>

<template>
  <div class="chatgpt-body">
    <!-- 头部 -->
    <ChatGPTBodyHeader />
    <!-- 消息列表 -->
    <ChatGPTBodyMessageList ref="bodyMessageListRef" />
    <!-- 输入区域 -->
    <ChatGPTBodyInput @update-message="bodyMessageListRef.scrollToBottom(true)" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body {
  height: 100%;
  min-width: 0;
  background-color: var(--el-fill-color-extra-light);
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
}
</style>
