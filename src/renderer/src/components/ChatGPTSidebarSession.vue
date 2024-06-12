<script setup lang="ts">
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()

// 组件传参
const session = defineModel<ChatSession>('session', {
  default: () => {}
})

// 切换会话
const activeSession = () => {
  chatSessionStore.activeSessionId = session.value.id!
}
</script>

<template>
  <div v-if="session.messages.length > 0" class="chatgpt-session-session" @click="activeSession()">
    {{ session.id }}
  </div>
</template>

<style lang="scss">
.chatgpt-session-session {
}
</style>
