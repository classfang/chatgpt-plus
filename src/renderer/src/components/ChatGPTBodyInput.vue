<script setup lang="ts">
import { Top } from '@element-plus/icons-vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { reactive, toRefs } from 'vue'

// 仓库
const appStateStore = useAppStateStore()
const chatSessionStore = useChatSessionStore()

// 数据绑定
const data = reactive({
  question: ''
})
const { question } = toRefs(data)

// 定义事件
const emits = defineEmits(['update-message'])

// 发送提问
const sendQuestion = async (event?: KeyboardEvent) => {
  // 加载中、内容为空、输入法回车，不发送消息
  if (appStateStore.chatgptLoading || !data.question.trim() || event?.isComposing) {
    event?.preventDefault()
    return
  } else if (event?.shiftKey) {
    return
  } else {
    event?.preventDefault()
  }

  // 加载中
  appStateStore.chatgptLoading = true

  // 提问记录
  chatSessionStore.pushMessage({
    type: 'chat',
    role: 'user',
    content: data.question.trim()
  })
  data.question = ''
  emits('update-message')

  // 正在回答
  appStateStore.chatgptAnswering = true

  // 回答记录
  setTimeout(() => {
    chatSessionStore.pushMessage({
      type: 'chat',
      role: 'assistant',
      content: '我不理解你的问题'
    })
    emits('update-message')

    appStateStore.chatgptAnswering = false
    appStateStore.chatgptLoading = false
  }, 3000)
}
</script>

<template>
  <div class="chatgpt-body-input">
    <div class="question-input">
      <el-input
        v-model="question"
        type="textarea"
        :placeholder="$t('app.chatgpt.body.input.question.placeholder')"
        :autosize="{ minRows: 1, maxRows: 8 }"
        resize="none"
        @keydown.enter="sendQuestion"
      />
    </div>
    <Top
      class="question-input-btn"
      :class="{ 'question-input-btn-available': question.trim().length > 0 }"
      @click="sendQuestion"
    />
  </div>
</template>

<style lang="scss">
.chatgpt-body-input {
  width: 100%;
  box-sizing: border-box;
  padding: $app-padding-base;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $app-padding-base;

  .question-input {
    min-width: 0;
    flex: 1 1 0;
    border-radius: $app-border-radius-large;
    overflow: hidden;

    .el-textarea__inner {
      min-height: $app-icon-size-large !important;
      padding: 8px $app-padding-large;
      box-shadow: none;
      background-color: var(--el-fill-color);
    }
  }

  .question-input-btn {
    background-color: var(--el-fill-color);
    height: $app-icon-size-large;
    width: $app-icon-size-large;
    border-radius: $app-border-radius-large;
    box-sizing: border-box;
    padding: $app-padding-base;
    transition: background-color $app-transition-base;

    &-available {
      background-color: var(--el-fill-color-darker);
      cursor: pointer;
    }
  }
}
</style>
