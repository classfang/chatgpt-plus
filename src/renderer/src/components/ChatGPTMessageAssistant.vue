<script setup lang="ts">
// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-assistant">{{ message.content }}</div>
</template>

<style lang="scss">
.chatgpt-message-assistant {
  width: 100%;
  flex-shrink: 0;
}
</style>
