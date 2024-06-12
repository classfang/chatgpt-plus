<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

// 仓库
const appStateStore = useAppStateStore()
const appSettingStore = useAppSettingStore()
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

  // 判断配置是否正确
  if (!appSettingStore.openAI.baseUrl) {
    errorAnswer(t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.openai.baseUrl'))
    return
  }
  if (!appSettingStore.openAI.apiKey) {
    errorAnswer(t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.openai.apiKey'))
    return
  }

  // // OpenAI实例
  // const openai = new OpenAI({
  //   apiKey,
  //   baseURL,
  //   dangerouslyAllowBrowser: true
  // })
  //
  // // 流式对话
  // const stream = await openai.chat.completions.create(
  //   {
  //     messages: chatMessages,
  //     model,
  //     stream: true,
  //     max_tokens: maxTokens
  //   },
  //   {
  //     signal: abortCtr?.signal
  //   }
  // )
  //
  // // 开始回答
  // startAnswer && startAnswer(sessionId)
  // // 连续回答
  // for await (const chunk of stream) {
  //   Logger.info('chat2openai:', chunk)
  //   appendAnswer && appendAnswer(sessionId, chunk.choices[0].delta.content ?? '')
  // }
  //
  // // 结束
  // end && end(sessionId)

  // 回答记录
  setTimeout(() => {
    chatSessionStore.pushMessage({
      type: 'chat',
      role: 'assistant',
      content: '我不理解你的问题'
    })
    emits('update-message')
  }, 3000)
}

// 流式回答
const streamAnswer = (content: string) => {
  if (!appStateStore.chatgptAnswering) {
    chatSessionStore.pushMessage({
      type: 'chat',
      role: 'assistant',
      content: content
    })
    appStateStore.chatgptAnswering = true
  }
  chatSessionStore.appendMessageContent(content)
}

// 错误回答
const errorAnswer = (content: string) => {
  chatSessionStore.pushMessage({
    type: 'error',
    role: 'assistant',
    content: content
  })
  finishAnswer()
}

// 完成回答
const finishAnswer = () => {
  appStateStore.chatgptAnswering = false
  appStateStore.chatgptLoading = false
}

// 停止回答
const stopAnswer = () => {}
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
    <div v-if="appStateStore.chatgptLoading" class="question-input-btn" @click="stopAnswer()">
      <div class="stop-answer-icon"></div>
    </div>
    <Promotion
      v-else
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
    border-radius: 50%;
    box-sizing: border-box;
    padding: $app-padding-base;
    transition: background-color $app-transition-base;
    display: flex;
    align-items: center;
    justify-content: center;

    &-available {
      background-color: var(--el-fill-color-darker);
      cursor: pointer;
    }

    .stop-answer-icon {
      width: 10px;
      height: 10px;
      background-color: var(--el-text-color-primary);
    }
  }
}
</style>
