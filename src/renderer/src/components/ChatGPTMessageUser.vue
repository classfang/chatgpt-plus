<script setup lang="ts">
// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-user">
    <div class="message-content">{{ message.content }}</div>
    <div class="message-console"></div>
  </div>
</template>

<style lang="scss">
.chatgpt-message-user {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $app-padding-base;

  .message-content {
    min-width: 0;
    max-width: 80%;
    flex: 1 1 0;
    white-space: pre-wrap;
    line-break: anywhere;
    background-color: var(--el-fill-color);
    box-sizing: border-box;
    padding: $app-padding-base $app-padding-large;
    border-radius: $app-border-radius-large;
    line-height: 1.5rem;
  }

  .message-console {
    height: $app-chatgpt-message-console-height;
  }
}
</style>
