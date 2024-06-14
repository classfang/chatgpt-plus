<script setup lang="ts">
import { ArrowLeft, ArrowRight, CopyDocument, Delete, Refresh } from '@element-plus/icons-vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { clipboardWriteText } from '@renderer/utils/ipc-util'

// 仓库
const chatSessionStore = useChatSessionStore()
const appStateStore = useAppStateStore()

// 定义事件
const emits = defineEmits(['regenerate'])

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-console">
    <template v-if="message.type === 'chat' && message.role === 'assistant' && message.choices">
      <el-button
        :icon="ArrowLeft"
        text
        circle
        @click="!appStateStore.chatgptLoading && chatSessionStore.messageChoice(message.id!, -1)"
      />
      <div>{{ (message.choiceIndex ?? 0) + 1 }} / {{ message.choices.length }}</div>
      <el-button
        :icon="ArrowRight"
        text
        circle
        @click="!appStateStore.chatgptLoading && chatSessionStore.messageChoice(message.id!, 1)"
      />
    </template>
    <el-button :icon="CopyDocument" text circle @click="clipboardWriteText(message.content)" />
    <el-button
      :icon="Refresh"
      text
      circle
      @click="!appStateStore.chatgptLoading && emits('regenerate')"
    />
    <el-button
      :icon="Delete"
      text
      circle
      @click="!appStateStore.chatgptLoading && chatSessionStore.deleteMessage(message.id!)"
    />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-console {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  button {
    margin: 0;
  }
}
</style>
