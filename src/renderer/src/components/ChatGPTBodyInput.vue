<script setup lang="ts">
import { CircleCloseFilled, Promotion } from '@element-plus/icons-vue'
import AppIcon from '@renderer/components/AppIcon.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { selectFile } from '@renderer/utils/ipc-util'
import { openaiChat } from '@renderer/utils/openai-util'
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
  question: '',
  attachmentList: [] as ChatMessageFile[]
})
const { question, attachmentList } = toRefs(data)

// 定义事件
const emits = defineEmits(['update-message'])

// 阻断控制
let abortCtr = new AbortController()

// 发送提问
const sendQuestion = async (event?: KeyboardEvent, regenerateFlag?: boolean) => {
  // 加载中、内容为空、输入法回车，不发送消息
  if (!regenerateFlag) {
    if (appStateStore.chatgptLoading || !data.question.trim() || event?.isComposing) {
      event?.preventDefault()
      return
    } else if (event?.shiftKey) {
      return
    } else {
      event?.preventDefault()
    }
  }

  // 加载中
  appStateStore.chatgptLoading = true

  // 是否无标题
  const noSessionNameFlag = chatSessionStore.getActiveSession!.name.trim().length === 0

  // 提问记录
  if (!regenerateFlag) {
    chatSessionStore.pushMessage({
      type: 'chat',
      role: 'user',
      content: data.question.trim()
    })
    data.question = ''
    emits('update-message')
  }

  // 阻断器
  const abortCtrSignal = abortCtr.signal

  // 开始回答
  if (!regenerateFlag) {
    streamAnswer()
  } else {
    appStateStore.chatgptAnswering = true
  }

  // 转换消息列表
  const sendMessages = convertMessages(
    chatSessionStore.getActiveSession!.messages,
    chatSessionStore.getActiveSession!.chatOption.contextSize,
    1
  )

  // 判断配置是否正确
  if (!appSettingStore.openAI.baseUrl) {
    errorAnswer(t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.openai.baseUrl'))
    return
  }
  if (!appSettingStore.openAI.apiKey) {
    errorAnswer(t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.openai.apiKey'))
    return
  }

  // OpenAI对话
  await openaiChat({
    baseURL: appSettingStore.openAI.baseUrl,
    apiKey: appSettingStore.openAI.apiKey,
    params: {
      stream: true,
      messages: sendMessages,
      model: chatSessionStore.getActiveSession!.chatOption.model,
      max_tokens: chatSessionStore.getActiveSession!.chatOption.maxTokens,
      temperature: chatSessionStore.getActiveSession!.chatOption.temperature,
      top_p: chatSessionStore.getActiveSession!.chatOption.topP,
      presence_penalty: chatSessionStore.getActiveSession!.chatOption.presencePenalty,
      frequency_penalty: chatSessionStore.getActiveSession!.chatOption.frequencyPenalty
    },
    abortCtrSignal: abortCtrSignal,
    answer: (content: string) => {
      streamAnswer(content)
      emits('update-message')
    },
    error: (error: any) => {
      errorAnswer(error.message)
    },
    end: () => {
      // 结束回答
      finishAnswer(noSessionNameFlag, regenerateFlag)
    }
  })
}

// 转换消息列表
const convertMessages = (
  messages: ChatMessage[],
  contextSize?: number,
  ignoreSize = 0
): OpenAI.ChatCompletionMessageParam[] => {
  return (
    messages
      // 跳过 ignoreSize 条记录，截取最后 contextSize 条记录，
      .slice(contextSize ? -(contextSize + 1 + ignoreSize) : 0, messages.length - ignoreSize)
      .filter((m) => m.type === 'chat')
      .map((m) => ({
        role: m.role,
        content: [{ type: 'text', text: m.content }]
      })) as OpenAI.ChatCompletionMessageParam[]
  )
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
const finishAnswer = (noSessionNameFlag?: boolean, regenerateFlag?: boolean) => {
  // 如果最后一条回答是空的内容则删除
  const latestMessage = chatSessionStore.getActiveSession?.messages.at(-1)
  if (latestMessage && !latestMessage.content) {
    chatSessionStore.deleteMessage(latestMessage.id!)
  }

  // 自动生成标题
  if (noSessionNameFlag && chatSessionStore.getActiveSession!.chatOption.autoGenerateSessionName) {
    generateSessionName(chatSessionStore.getActiveSession!.id!)
  }

  // 保存当前回答到最后一个choice
  if (regenerateFlag) {
    // 最新一条消息
    const latestMessage = chatSessionStore.getActiveSession!.messages.at(-1)!
    if (latestMessage.choices) {
      latestMessage.choices[latestMessage.choices.length - 1] = latestMessage.content
    }
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

  // OpenAI对话
  await openaiChat({
    baseURL: appSettingStore.openAI.baseUrl,
    apiKey: appSettingStore.openAI.apiKey,
    params: {
      stream: true,
      model: chatSessionStore.getActiveSession!.chatOption.model,
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
    },
    answer: (content: string) => {
      // 拼接名称
      sessionName += content.trim()
      // 根据id获取session
      const session = chatSessionStore.getSessionById(sessionId)
      if (session && sessionName.length > 0) {
        session.name = sessionName
      }
    }
  })
}

// 重新生成
const regenerate = (messageId: string) => {
  // 删除之后的所有消息
  if (!chatSessionStore.deleteMessagesFrom(messageId)) {
    return
  }

  // 最新一条消息
  const latestMessage = chatSessionStore.getActiveSession!.messages.at(-1)!

  // 错误消息修改类型即可
  if (latestMessage.type === 'error') {
    latestMessage.type = 'chat'
  } else {
    // 初始化choices
    if (!latestMessage.choices) {
      latestMessage.choices = [latestMessage.content, '']
    } else {
      latestMessage.choices.push('')
    }

    // 初始化choiceIndex
    if (!latestMessage.choiceIndex) {
      latestMessage.choiceIndex = 1
    } else {
      latestMessage.choiceIndex++
    }
  }

  // 清空当前内容
  latestMessage.content = ''

  // 重新生成
  sendQuestion(undefined, true)
}

// 选择附件
const selectAttachment = async () => {
  // 支持图片类型：https://platform.openai.com/docs/guides/vision/what-type-of-files-can-i-upload
  const files = await selectFile(true, ['.png', '.jpg', '.jpeg', '.webp', '.gif'])
  files.forEach((file) => {
    data.attachmentList.push({
      name: file.name,
      extname: file.extname,
      path: file.path,
      size: file.stat.size
    })
  })
}

// 删除附件
const deleteAttachment = (index: number) => {
  data.attachmentList.splice(index, 1)
}

// 暴露函数
defineExpose({
  regenerate
})
</script>

<template>
  <div class="chatgpt-body-input">
    <div class="question-input">
      <!-- 附件列表 -->
      <div v-if="attachmentList.length > 0" class="question-input-file-list">
        <div v-for="(att, index) in attachmentList" :key="att.path" class="file-item">
          <el-image
            v-if="['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(att.extname.toLowerCase())"
            class="item-image"
            :src="`file://${att.path}`"
            :preview-src-list="attachmentList.map((a) => `file://${a.path}`)"
            :initial-index="index"
            fit="cover"
          />
          <CircleCloseFilled class="item-close-btn" @click="deleteAttachment(index)" />
        </div>
      </div>
      <div class="question-input-textarea-container">
        <!-- 附件选择 -->
        <AppIcon name="attachment" class="attachment-btn" @click="selectAttachment()" />

        <!-- 文本域 -->
        <el-input
          v-model="question"
          type="textarea"
          :placeholder="$t('app.chatgpt.body.input.question.placeholder')"
          :autosize="{ minRows: 1, maxRows: 8 }"
          resize="none"
          @keydown.enter="sendQuestion"
        />
      </div>
    </div>

    <!-- 停止按钮 -->
    <AppIcon
      v-if="appStateStore.chatgptLoading"
      name="stop"
      class="question-input-btn question-input-btn-available"
      @click="stopAnswer()"
    />

    <!-- 发送按钮 -->
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
    background-color: var(--el-fill-color);
    display: flex;
    flex-direction: column;
    gap: $app-padding-small;

    .question-input-file-list {
      box-sizing: border-box;
      padding: $app-padding-small;
      display: flex;
      gap: $app-padding-small;
      flex-wrap: wrap;

      .file-item {
        height: 60px;
        width: 60px;
        position: relative;

        .item-image {
          height: 100%;
          width: 100%;
          border-radius: $app-border-radius-base;
        }

        .item-close-btn {
          height: $app-icon-size-small;
          width: $app-icon-size-small;
          position: absolute;
          top: calc($app-icon-size-small / -2);
          right: calc($app-icon-size-small / -2);
        }
      }
    }

    .question-input-textarea-container {
      width: 100%;
      display: flex;
      align-items: flex-end;

      .attachment-btn {
        height: $app-icon-size-large;
        width: $app-icon-size-large;
        border-radius: 50%;
        box-sizing: border-box;
        padding: $app-padding-small;
        cursor: pointer;
        color: var(--el-text-color-primary);
      }

      :deep(.el-textarea__inner) {
        padding: $app-padding-small $app-padding-extra-small $app-padding-small 0;
        box-shadow: none;
        background-color: var(--el-fill-color);
      }
    }
  }

  .question-input-btn {
    background-color: var(--el-fill-color);
    height: $app-icon-size-large;
    width: $app-icon-size-large;
    border-radius: 50%;
    box-sizing: border-box;
    padding: $app-padding-small;
    color: var(--el-text-color-secondary);
    transition: all $app-transition-base;
    display: flex;
    align-items: center;
    justify-content: center;

    &-available {
      background-color: var(--el-fill-color-darker);
      cursor: pointer;
      color: var(--el-text-color-primary);
    }
  }
}
</style>
