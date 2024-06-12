<script setup lang="ts">
// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-user">
    <div>{{ message.content }}</div>
  </div>
</template>

<style lang="scss">
.chatgpt-message-user {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
}
</style>
