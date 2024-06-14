<script setup lang="ts">
import chatgptAvatar from '@renderer/assets/image/chatgpt-avatar.png'
import ChatGPTMessageConsole from '@renderer/components/ChatGPTMessageConsole.vue'

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-error">
    <el-avatar :size="38" :src="chatgptAvatar" />
    <div class="message-content-container">
      <div class="message-content select-text">{{ message.content }}</div>
      <ChatGPTMessageConsole v-model:message="message" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-error {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: $app-padding-small;

  .message-content-container {
    min-width: 0;
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $app-padding-small;

    .message-content {
      min-width: 4rem;
      max-width: 80%;
      flex: 1 1 0;
      white-space: pre-wrap;
      line-break: anywhere;
      background-color: var(--el-fill-color);
      box-sizing: border-box;
      padding: $app-padding-small;
      border-radius: calc(1.5rem / 2 + $app-padding-small);
      line-height: 1.3rem;
      display: flex;
      justify-content: center;
      color: var(--el-color-error);
    }
  }
}
</style>
