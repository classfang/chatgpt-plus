<script setup lang="ts">
import chatgptAvatar from '@renderer/assets/image/chatgpt-avatar.png'
import ChatGPTBodyPrompt from '@renderer/components/body/ChatGPTBodyPrompt.vue'

// 事件
const emits = defineEmits(['use-prompt'])
</script>

<template>
  <div class="chatgpt-body-empty">
    <el-avatar :size="50" :src="chatgptAvatar" />
    <div>{{ $t('app.chatgpt.body.empty.content') }}</div>
    <ChatGPTBodyPrompt @use-prompt="(prompt) => emits('use-prompt', prompt)" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-empty {
  min-height: 0;
  width: 100%;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $app-padding-large;
  font-size: var(--el-font-size-large);

  * {
    flex-shrink: 0;
  }
}
</style>
