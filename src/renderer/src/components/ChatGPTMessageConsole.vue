<script setup lang="ts">
// 组件传参
import { CopyDocument } from '@element-plus/icons-vue'

const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-console">
    <CopyDocument class="console-icon" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-console {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: $app-padding-small;

  .console-icon {
    height: $app-icon-size-small;
    width: $app-icon-size-small;
  }
}
</style>
