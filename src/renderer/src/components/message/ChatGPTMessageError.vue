<script setup lang="ts">
import ChatGPTMessageConsole from '@renderer/components/message/ChatGPTMessageConsole.vue'

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})

// 定义事件
const emits = defineEmits(['regenerate'])
</script>

<template>
  <div class="chatgpt-message-error">
    <div class="message-content-container">
      <div class="message-content select-text">{{ message.content }}</div>
      <ChatGPTMessageConsole
        v-model:message="message"
        class="message-console"
        @regenerate="emits('regenerate')"
      />
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
    gap: $app-padding-extra-small;

    .message-content {
      min-width: calc($app-line-height-base + $app-padding-small * 2);
      max-width: 80%;
      flex: 1 1 0;
      white-space: pre-wrap;
      line-break: anywhere;
      background-color: var(--el-fill-color);
      box-sizing: border-box;
      padding: $app-padding-small $app-padding-base;
      border-radius: calc($app-line-height-base / 2 + $app-padding-small);
      line-height: $app-line-height-base;
      display: flex;
      justify-content: center;
      color: var(--el-color-error);
    }

    .message-console {
      opacity: 0;
      transition: opacity $app-transition-base;
    }

    &:hover {
      .message-console {
        opacity: 1;
      }
    }
  }
}
</style>
