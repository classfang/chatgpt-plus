<script setup lang="ts">
import AppIcon from '@renderer/components/AppIcon.vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { clipboardWriteText } from '@renderer/utils/ipc-util'
import { reactive, toRefs } from 'vue'

// 仓库
const chatSessionStore = useChatSessionStore()
const appStateStore = useAppStateStore()

// 数据绑定
const data = reactive({
  speechLoading: false,
  speechFlag: false
})
const { speechLoading, speechFlag } = toRefs(data)

// 定义事件
const emits = defineEmits(['regenerate'])

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})

// 发音
const speechStart = () => {
  if (data.speechLoading) {
    return
  }
  data.speechLoading = true
  setTimeout(() => {
    data.speechLoading = false
    data.speechFlag = true
  }, 3000)
}

// 停止发音
const speechStop = () => {
  data.speechFlag = false
}
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
      <el-button v-if="speechFlag" text circle @click="speechStop()">
        <AppIcon name="stop" :width="18" :height="18" />
      </el-button>
      <el-button v-else text circle @click="speechStart()">
        <AppIcon v-if="speechLoading" class="rotate" name="loading" :width="18" :height="18" />
        <AppIcon v-else name="speech" :width="18" :height="18" />
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
