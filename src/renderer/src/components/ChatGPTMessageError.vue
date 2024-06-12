<script setup lang="ts">
// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-error">
    <div class="message-content select-text">{{ message.content }}</div>
    <div class="message-console"></div>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-error {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $app-padding-base;

  .message-content {
    min-width: 4rem;
    max-width: 80%;
    flex: 1 1 0;
    white-space: pre-wrap;
    line-break: anywhere;
    background-color: var(--el-fill-color);
    box-sizing: border-box;
    padding: $app-padding-base $app-padding-large;
    border-radius: calc(1.5rem / 2 + $app-padding-base);
    line-height: 1.5rem;
    display: flex;
    justify-content: center;
    color: var(--el-color-error);
  }

  .message-console {
    height: $app-chatgpt-message-console-height;
  }
}
</style>
