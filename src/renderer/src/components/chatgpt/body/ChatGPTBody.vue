<script setup lang="ts">
import ChatGPTBodyEmpty from '@renderer/components/chatgpt/body/ChatGPTBodyEmpty.vue'
import ChatGPTBodyHeader from '@renderer/components/chatgpt/body/ChatGPTBodyHeader.vue'
import ChatGPTBodyInput from '@renderer/components/chatgpt/body/ChatGPTBodyInput.vue'
import ChatGPTBodyMessageList from '@renderer/components/chatgpt/body/ChatGPTBodyMessageList.vue'
import ChatGPTBodyShare from '@renderer/components/chatgpt/body/ChatGPTBodyShare.vue'
import { useStore } from '@renderer/store/store'
import { ref, reactive, toRefs, nextTick, watch } from 'vue'

// 仓库
const { chatSessionStore } = useStore()

// ref
const bodyMessageListRef = ref()
const bodyInputRef = ref()

// 数据绑定
const data = reactive({
  messageCheckboxVisible: false,
  messageCheckIds: [] as string[]
})
const { messageCheckboxVisible, messageCheckIds } = toRefs(data)

// 监听消息选择是否可见
watch(
  () => data.messageCheckboxVisible,
  () => {
    if (data.messageCheckboxVisible) {
      onShare()
    }
  }
)

// 分享触发
const onShare = () => {
  data.messageCheckIds = chatSessionStore.getActiveSession!.messages.map((m) => m.id!)
  data.messageCheckboxVisible = true
  nextTick(() => {
    bodyMessageListRef.value?.scrollToBottom(false)
  })
}
</script>

<template>
  <div class="chatgpt-body">
    <!-- 头部 -->
    <ChatGPTBodyHeader v-model:shareVisible="messageCheckboxVisible" />

    <!-- 消息列表 -->
    <ChatGPTBodyMessageList
      v-if="chatSessionStore.getActiveSession!.messages.length > 0"
      ref="bodyMessageListRef"
      v-model:message-check-ids="messageCheckIds"
      :message-checkbox-visible="messageCheckboxVisible"
      @regenerate="(messageId: string) => bodyInputRef.regenerate(messageId)"
    />

    <!-- 空状态 -->
    <ChatGPTBodyEmpty v-else @use-prompt="(prompt) => bodyInputRef.updateQuestion(prompt)" />

    <!-- 输入区域 -->
    <ChatGPTBodyInput
      v-if="!messageCheckboxVisible"
      ref="bodyInputRef"
      @send-question="bodyMessageListRef?.scrollToBottom(false)"
      @update-message="bodyMessageListRef?.scrollToBottom(true)"
    />

    <!-- 分享按钮组 -->
    <ChatGPTBodyShare
      v-else
      v-model:visible="messageCheckboxVisible"
      v-model:message-check-ids="messageCheckIds"
    />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body {
  height: 100%;
  min-width: 0;
  flex: 1 1 0;
  background-color: var(--el-fill-color-extra-light);
  display: flex;
  flex-direction: column;
  gap: $app-padding-small;
}
</style>
