<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { Logger } from '@renderer/utils/logger'
import OpenAI from 'openai'
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

// 阻断控制
let abortCtr = new AbortController()

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

  // 是否无标题
  const noSessionNameFlag = chatSessionStore.getActiveSession!.name.trim().length === 0

  // 提问记录
  chatSessionStore.pushMessage({
    type: 'chat',
    role: 'user',
    content: data.question.trim()
  })
  data.question = ''
  emits('update-message')

  // 阻断器
  const abortCtrSignal = abortCtr.signal

  // 转换消息列表
  const sendMessages = convertMessages(
    chatSessionStore.getActiveSession!.messages,
    chatSessionStore.getActiveSession!.contextSize
  )

  // 开始回答
  streamAnswer()

  // 判断配置是否正确
  if (!appSettingStore.openAI.baseUrl) {
    errorAnswer(t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.openai.baseUrl'))
    return
  }
  if (!appSettingStore.openAI.apiKey) {
    errorAnswer(t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.openai.apiKey'))
    return
  }

  try {
    // OpenAI实例
    const openai = new OpenAI({
      baseURL: appSettingStore.openAI.baseUrl,
      apiKey: appSettingStore.openAI.apiKey,
      dangerouslyAllowBrowser: true
    })

    // 流式对话
    const sendBody: OpenAI.ChatCompletionCreateParams = {
      stream: true,
      messages: sendMessages,
      model: chatSessionStore.getActiveSession!.model,
      max_tokens: chatSessionStore.getActiveSession!.maxTokens,
      temperature: chatSessionStore.getActiveSession!.temperature,
      top_p: chatSessionStore.getActiveSession!.topP,
      presence_penalty: chatSessionStore.getActiveSession!.presencePenalty,
      frequency_penalty: chatSessionStore.getActiveSession!.frequencyPenalty
    }
    Logger.info('ChatGPT request body: ', sendBody)
    const stream = await openai.chat.completions.create(sendBody, {
      signal: abortCtrSignal
    })

    // 连续回答
    for await (const chunk of stream) {
      if (abortCtrSignal.aborted) {
        return
      }
      Logger.info('ChatGPT response chunk: ', chunk)
      streamAnswer(chunk.choices[0].delta.content ?? '')
      emits('update-message')
    }
  } catch (e: any) {
    errorAnswer(e.message)
  }

  // 自动生成标题
  if (noSessionNameFlag && appSettingStore.openAI.autoGenerateSessionName) {
    generateSessionName(chatSessionStore.getActiveSession!.id!)
  }

  // 结束回答
  finishAnswer()
}

// 转换消息列表
const convertMessages = (
  messages: ChatMessage[],
  contextSize?: number
): OpenAI.ChatCompletionMessageParam[] => {
  return messages
    .slice(messages.findLastIndex((m) => m.type === 'separator') + 1)
    .slice(contextSize ? -(contextSize + 1) : 0)
    .filter((m) => m.type === 'chat')
    .map((m) => ({
      role: m.role,
      content: [{ type: 'text', text: m.content }]
    })) as OpenAI.ChatCompletionMessageParam[]
}

// 流式回答
const streamAnswer = (content = '') => {
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
  // 先关闭之前的回答
  finishAnswer()
  chatSessionStore.pushMessage({
    type: 'error',
    role: 'assistant',
    content: content
  })
}

// 完成回答
const finishAnswer = () => {
  // 如果最后一条回答是空的内容则删除
  const latestMessage = chatSessionStore.getActiveSession?.messages.at(-1)
  if (latestMessage && !latestMessage.content) {
    chatSessionStore.deleteMessage(latestMessage.id!)
  }

  appStateStore.chatgptAnswering = false
  appStateStore.chatgptLoading = false
}

// 停止回答
const stopAnswer = () => {
  abortCtr.abort()
  abortCtr = new AbortController()
  finishAnswer()
}

// 生成会话名称
const generateSessionName = async (sessionId: string) => {
  let sessionName = ''

  try {
    // OpenAI实例
    const openai = new OpenAI({
      baseURL: appSettingStore.openAI.baseUrl,
      apiKey: appSettingStore.openAI.apiKey,
      dangerouslyAllowBrowser: true
    })

    // 流式对话
    const sendBody: OpenAI.ChatCompletionCreateParams = {
      stream: true,
      model: chatSessionStore.getActiveSession!.model,
      messages: [
        ...convertMessages(chatSessionStore.getActiveSession!.messages),
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: t('app.chatgpt.prompt.generateTitle')
            }
          ]
        }
      ]
    }
    Logger.info('ChatGPT generateSessionName request body: ', sendBody)
    const stream = await openai.chat.completions.create(sendBody)

    // 连续回答
    for await (const chunk of stream) {
      Logger.info('ChatGPT generateSessionName response chunk: ', chunk)
      // 拼接名称
      sessionName = (sessionName + (chunk.choices[0].delta.content ?? '')).trim()
      // 根据id获取session
      const session = chatSessionStore.getSessionById(sessionId)
      if (session && sessionName.length > 0) {
        session.name = sessionName
      }
    }
  } catch (e: any) {
    Logger.info('ChatGPT generateSessionName error: ', e.message)
  }
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

<style lang="scss" scoped>
.chatgpt-body-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0 $app-padding-base $app-padding-base $app-padding-base;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $app-padding-small;

  .question-input {
    min-width: 0;
    flex: 1 1 0;
    border-radius: $app-border-radius-large;
    overflow: hidden;

    :deep(.el-textarea__inner) {
      min-height: $app-icon-size-large !important;
      padding: 8px $app-padding-base;
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
    padding: $app-padding-small;
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
