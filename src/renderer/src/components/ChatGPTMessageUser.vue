<script setup lang="ts">
// 组件传参
import ChatGPTMessageConsole from '@renderer/components/ChatGPTMessageConsole.vue'

const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-user">
    <div class="message-content select-text">{{ message.content }}</div>
    <ChatGPTMessageConsole v-model:message="message" class="message-console" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-user {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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
  }

  .message-console {
    opacity: 0;
    transition: opacity $app-transition-base;
    justify-content: flex-end;
  }

  &:hover {
    .message-console {
      opacity: 1;
    }
  }
}
</style>
