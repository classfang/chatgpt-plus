<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  CopyDocument,
  Delete,
  Refresh,
  VideoPlay
} from '@element-plus/icons-vue'
import AppIcon from '@renderer/components/AppIcon.vue'
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
        text
        circle
        @click="!appStateStore.chatgptLoading && chatSessionStore.messageChoice(message.id!, -1)"
      >
        <AppIcon name="arrow-left" :width="18" :height="18" />
      </el-button>
      <div>{{ (message.choiceIndex ?? 0) + 1 }} / {{ message.choices.length }}</div>
      <el-button
        text
        circle
        @click="!appStateStore.chatgptLoading && chatSessionStore.messageChoice(message.id!, 1)"
      >
        <AppIcon name="arrow-right" :width="18" :height="18" />
      </el-button>
    </template>
    <template v-if="message.content && message.content.length > 0">
      <el-button text circle>
        <AppIcon name="speech" :width="18" :height="18" />
      </el-button>
    </template>
    <el-button text circle @click="clipboardWriteText(message.content)">
      <AppIcon name="copy" :width="18" :height="18" />
    </el-button>
    <template
      v-if="
        message.role === 'assistant' &&
        chatSessionStore.getActiveSession?.messages.at(0)?.id != message.id
      "
    >
      <el-button text circle @click="!appStateStore.chatgptLoading && emits('regenerate')">
        <AppIcon name="refresh" :width="18" :height="18" />
      </el-button>
    </template>
    <el-button
      text
      circle
      @click="!appStateStore.chatgptLoading && chatSessionStore.deleteMessage(message.id!)"
    >
      <AppIcon name="delete" :width="18" :height="18" />
    </el-button>
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
