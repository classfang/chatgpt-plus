<script setup lang="ts">
import ChatGPTMessageConsole from '@renderer/components/message/ChatGPTMessageConsole.vue'

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-system">
    <div class="message-content select-text">
      <!-- 文本内容 -->
      <span>{{ message.content }}</span>
    </div>
    <ChatGPTMessageConsole v-model:message="message" class="message-console" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-system {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $app-padding-extra-small;

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
    line-height: $app-line-height-base;
    display: flex;
    flex-direction: column;
    gap: $app-padding-extra-small;
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
