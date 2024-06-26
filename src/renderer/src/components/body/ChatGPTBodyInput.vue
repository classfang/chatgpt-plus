<script setup lang="ts">
import { CircleCloseFilled, Promotion } from '@element-plus/icons-vue'
import AppIcon from '@renderer/components/icon/AppIcon.vue'
import FileIcon from '@renderer/components/icon/FileIcon.vue'
import {
  langChainLoadFile,
  readLocalImageBase64,
  saveFileByBase64,
  saveFileByPath,
  selectFile,
  showItemInFolder
} from '@renderer/service/ipc-service'
import { openaiChat } from '@renderer/service/openai-service'
import { getToolsDefine, ToolEnum, toolsUse } from '@renderer/service/tool-service'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { formatFileSize } from '@renderer/utils/file-util'
import { generateUUID } from '@renderer/utils/id-util'
import { Logger } from '@renderer/utils/logger'
import { join } from '@renderer/utils/path-util'
import OpenAI from 'openai'
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
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
  imageList: [] as ChatMessageFile[],
  fileList: [] as ChatMessageFile[]
})
const { question, imageList, fileList } = toRefs(data)

// 定义事件
const emits = defineEmits(['send-question', 'update-message'])

// ref
const inputTextareaRef = ref()

// 阻断控制
let abortCtr = new AbortController()

// 文本域获得焦点
const inputTextareaFocus = () => {
  nextTick(() => {
    inputTextareaRef.value?.focus()
  })
}

// 发送提问
const sendQuestion = async (event?: KeyboardEvent, regenerateFlag?: boolean) => {
  // 加载中、内容为空、输入法回车，不发送消息
  if (!regenerateFlag) {
    if (
      appStateStore.chatgptLoading ||
      appStateStore.uploading ||
      !data.question.trim() ||
      event?.isComposing
    ) {
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

  emits('send-question')

  // 是否无标题
  const noSessionNameFlag = chatSessionStore.getActiveSession!.name.trim().length === 0

  // 提问记录
  if (!regenerateFlag) {
    chatSessionStore.pushMessage({
      type: 'chat',
      role: 'user',
      content: data.question.trim(),
      images: data.imageList,
      files: data.fileList
    })
    data.question = ''
    data.imageList = []
    data.fileList = []
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
  const sendMessages = await convertMessages(
    chatSessionStore.getActiveSession!.messages,
    chatSessionStore.getActiveSession!.chatOption.contextSize,
    1
  )

  // 工具名称列表
  const toolNameList: ToolEnum[] = []
  if (chatSessionStore.getActiveSession!.textToImageOption?.enabled) {
    toolNameList.push(ToolEnum.TEXT_TO_IMAGE)
  }
  if (chatSessionStore.getActiveSession!.internetSearchOption?.enabled) {
    toolNameList.push(ToolEnum.INTERNET_SEARCH)
  }

  // 判断配置是否正确
  if (!appSettingStore.openAI.baseUrl) {
    errorAnswer(t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.openai.baseUrl'))
    return
  }
  if (!appSettingStore.openAI.apiKey) {
    errorAnswer(t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.openai.apiKey'))
    return
  }
  if (toolNameList.includes(ToolEnum.INTERNET_SEARCH)) {
    if (!appSettingStore.internetSearchOption.google.baseUrl) {
      errorAnswer(
        t('app.chatgpt.body.input.pleaseConfigure') +
          t('app.setting.item.internetSearch.google.baseUrl')
      )
      return
    }
    if (!appSettingStore.internetSearchOption.google.key) {
      errorAnswer(
        t('app.chatgpt.body.input.pleaseConfigure') +
          t('app.setting.item.internetSearch.google.key')
      )
      return
    }
    if (!appSettingStore.internetSearchOption.google.cx) {
      errorAnswer(
        t('app.chatgpt.body.input.pleaseConfigure') + t('app.setting.item.internetSearch.google.cx')
      )
      return
    }
  }

  // 工具调用参数记录
  let toolCallId = ''
  let functionName = ''
  let functionArguments = ''

  // OpenAI对话
  await openaiChat({
    baseURL: appSettingStore.openAI.baseUrl,
    apiKey: appSettingStore.openAI.apiKey,
    params: {
      stream: true,
      messages: sendMessages,
      tools: toolNameList.length > 0 ? getToolsDefine(toolNameList) : undefined,
      model: chatSessionStore.getActiveSession!.chatOption.model,
      max_tokens: chatSessionStore.getActiveSession!.chatOption.maxTokens,
      temperature: chatSessionStore.getActiveSession!.chatOption.temperature,
      top_p: chatSessionStore.getActiveSession!.chatOption.topP,
      presence_penalty: chatSessionStore.getActiveSession!.chatOption.presencePenalty,
      frequency_penalty: chatSessionStore.getActiveSession!.chatOption.frequencyPenalty
    },
    abortCtrSignal: abortCtrSignal,
    answer: (chunk: OpenAI.ChatCompletionChunk) => {
      // 是否是tool_calls（当前只获取第一个工具调用）
      if (
        toolNameList.length > 0 &&
        chunk.choices[0].delta.tool_calls &&
        chunk.choices[0].delta.tool_calls[0]
      ) {
        if (chunk.choices[0].delta.tool_calls[0].id) {
          toolCallId = chunk.choices[0].delta.tool_calls[0].id
        }
        if (chunk.choices[0].delta.tool_calls[0].function?.name) {
          functionName = chunk.choices[0].delta.tool_calls[0].function?.name
        }
        if (chunk.choices[0].delta.tool_calls[0].function?.arguments) {
          functionArguments += chunk.choices[0].delta.tool_calls[0].function?.arguments
        }
      } else if (chunk.choices[0].delta.content) {
        streamAnswer(chunk.choices[0].delta.content)
      }
      emits('update-message')
    },
    error: (error: any) => {
      errorAnswer(error.message)
    },
    end: async () => {
      if (toolCallId && functionName && functionArguments) {
        // 运行插件
        try {
          appStateStore.currentToolName = functionName
          const toolResult = await toolsUse(
            functionName,
            functionArguments,
            abortCtrSignal,
            chatSessionStore.getActiveSession!,
            appSettingStore
          )
          appStateStore.currentToolName = null

          // 针对不同的插件进行结果处理
          if (ToolEnum.TEXT_TO_IMAGE === functionName) {
            // 图片生成回答
            streamAnswer(t('app.chatgpt.body.message.textToImageContent'), JSON.parse(toolResult))
            // 结束回答
            finishAnswer(noSessionNameFlag, regenerateFlag)
          } else if (ToolEnum.INTERNET_SEARCH === functionName) {
            // 记录搜索结果
            streamAnswer('', undefined, JSON.parse(toolResult))
            // 继续调用对话能力
            sendMessages.push({
              role: 'assistant',
              content: null,
              tool_calls: [
                {
                  id: toolCallId,
                  type: 'function',
                  function: { name: functionName, arguments: functionArguments }
                }
              ]
            })
            sendMessages.push({
              role: 'tool',
              tool_call_id: toolCallId,
              content: toolResult
            })
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
              answer: (chunk: OpenAI.ChatCompletionChunk) => {
                streamAnswer(chunk.choices[0].delta.content ?? '')
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
        } catch (error: any) {
          errorAnswer(error.message)
        }
      } else {
        // 结束回答
        finishAnswer(noSessionNameFlag, regenerateFlag)
      }
    }
  })
}

// 转换消息列表
const convertMessages = async (
  messages: ChatMessage[],
  contextSize?: number,
  ignoreSize = 0,
  ignoreFile = false
): Promise<OpenAI.ChatCompletionMessageParam[]> => {
  const chatMessages = messages
    // 跳过 ignoreSize 条记录，截取最后 contextSize 条记录，
    .slice(contextSize ? -(contextSize + 1 + ignoreSize) : 0, messages.length - ignoreSize)
    .filter((m) => m.type === 'chat')

  const convertMessageResult = [] as OpenAI.ChatCompletionMessageParam[]
  for (const m of chatMessages) {
    // 真实发送的文本
    let realText = m.content

    // 将文件内容拼接到用户消息中
    if (!ignoreFile && m.files && m.files.length > 0) {
      const fileContentList: Record<string, string> = {}
      for (const f of m.files) {
        fileContentList[f.name] = await langChainLoadFile(join(appStateStore.cachePath, f.saveName))
      }
      realText = `Files Data:\n${JSON.stringify(fileContentList)}\n${realText}`
    }

    // 文本消息
    const content = [{ type: 'text', text: realText }] as OpenAI.ChatCompletionContentPart[]

    // 处理用户消息中的图片
    if (!ignoreFile && m.role === 'user' && m.images && m.images.length > 0) {
      for (const image of m.images) {
        const imageBase64Data = await readLocalImageBase64(
          join(appStateStore.cachePath, image.saveName)
        )
        content.push({
          type: 'image_url',
          image_url: {
            url: `data:image/${image.extname.replace('.', '')};base64,${imageBase64Data}`
          }
        })
      }
    }

    convertMessageResult.push({
      role: m.role,
      content: content
    } as OpenAI.ChatCompletionMessageParam)
  }

  return convertMessageResult
}

// 流式回答
const streamAnswer = (
  content = '',
  images?: ChatMessageFile[],
  searchItems?: InternetSearchResultItem[]
) => {
  if (!appStateStore.chatgptAnswering) {
    chatSessionStore.pushMessage({
      type: 'chat',
      role: 'assistant',
      content: content,
      images: images,
      searchItems: searchItems
    })
    appStateStore.chatgptAnswering = true
  }
  chatSessionStore.appendMessageContent(content, images, searchItems)
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
      latestMessage.choices[latestMessage.choices.length - 1].content = latestMessage.content
      latestMessage.choices[latestMessage.choices.length - 1].images = latestMessage.images
      latestMessage.choices[latestMessage.choices.length - 1].searchItems =
        latestMessage.searchItems
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
        ...(await convertMessages(
          chatSessionStore.getActiveSession!.messages,
          undefined,
          undefined,
          true
        )),
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
    answer: (chunk: OpenAI.ChatCompletionChunk) => {
      // 拼接名称
      sessionName += chunk.choices[0].delta.content?.trim() ?? ''
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
      latestMessage.choices = [
        {
          content: latestMessage.content,
          images: latestMessage.images,
          searchItems: latestMessage.searchItems
        }
      ]
    }
    latestMessage.choices.push({
      content: '',
      images: [],
      searchItems: []
    })

    // 初始化choiceIndex
    if (!latestMessage.choiceIndex) {
      latestMessage.choiceIndex = 1
    } else {
      latestMessage.choiceIndex++
    }
  }

  // 清空当前内容
  latestMessage.content = ''
  latestMessage.images = []
  latestMessage.searchItems = []

  // 重新生成
  sendQuestion(undefined, true)
}

// 选择附件
const selectAttachment = async () => {
  if (appStateStore.uploading) {
    return
  }
  appStateStore.uploading = true

  try {
    // 支持图片类型：https://platform.openai.com/docs/guides/vision/what-type-of-files-can-i-upload
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    const fileExtensions = ['.text', '.pdf', '.docx', '.pptx', '.xlsx']
    const files = await selectFile(true, [...imageExtensions, ...fileExtensions])

    for (const file of files) {
      // 保存文件到缓存目录
      const saveName = await saveFileByPath(file.path, `${generateUUID()}${file.extname}`)
      const chatFile: ChatMessageFile = {
        name: file.name,
        saveName: saveName,
        extname: file.extname,
        size: file.stat.size
      }

      // 图片和文件分开存储
      if (imageExtensions.includes(chatFile.extname.toLowerCase())) {
        data.imageList.push(chatFile)
      } else if (fileExtensions.includes(chatFile.extname.toLowerCase())) {
        data.fileList.push(chatFile)
      }
    }
  } catch (error) {
    Logger.error('selectAttachment error: ', error)
  } finally {
    appStateStore.uploading = false
  }
}

// 输入框粘贴监听
const handleInputPaste = (event: ClipboardEvent) => {
  // 获取粘贴的内容
  const items = event.clipboardData?.items
  if (!items) {
    return
  }

  // 只获取第一张图片
  const item = items[0]
  if (item && item.kind === 'file' && item.type.startsWith('image/')) {
    // 阻止默认粘贴行为
    event.preventDefault()
    // 获取图片数据
    const blob = item.getAsFile()
    if (blob) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          // 获取 base64 数据
          const imageUrl = e.target.result as string
          if (!imageUrl) {
            return
          }
          const imageBase64 = imageUrl.split('base64,')[1]
          if (!imageBase64) {
            return
          }

          // 随机文件名
          const extname = '.png'
          const fileName = `${generateUUID()}${extname}`

          // 保存到本地
          saveFileByBase64(imageBase64, fileName).then((saveName) => {
            // 保存成功后添加到图片预览
            data.imageList.push({
              name: fileName,
              saveName: saveName,
              extname: extname,
              size: blob.size
            })
          })
        }
      }
      // 加载图片数据
      reader.readAsDataURL(blob)
    }
  }
}

// 删除图片
const deleteImage = (index: number) => {
  data.imageList.splice(index, 1)
}

// 删除文件
const deleteFile = (index: number) => {
  data.fileList.splice(index, 1)
}

// 修改问题输入
const updateQuestion = (prompt: string) => {
  data.question = prompt
}

// 暴露函数
defineExpose({
  regenerate,
  updateQuestion
})

onMounted(() => {
  // 自动聚焦
  inputTextareaFocus()
})
</script>

<template>
  <div class="chatgpt-body-input">
    <div class="question-input">
      <!-- 图片列表 -->
      <div v-if="imageList.length > 0" class="question-input-file-list">
        <div v-for="(att, index) in imageList" :key="att.saveName" class="image-item">
          <el-image
            class="item-image"
            :src="`file://${join(appStateStore.cachePath, att.saveName)}`"
            :preview-src-list="
              imageList.map((a) => `file://${join(appStateStore.cachePath, a.saveName)}`)
            "
            :initial-index="index"
            fit="cover"
          />
          <CircleCloseFilled class="item-close-btn" @click.stop="deleteImage(index)" />
        </div>
      </div>
      <!-- 文件列表 -->
      <div v-if="fileList.length > 0" class="question-input-file-list">
        <div
          v-for="(att, index) in fileList"
          :key="att.saveName"
          class="file-item"
          @click="showItemInFolder(join(appStateStore.cachePath, att.saveName))"
        >
          <FileIcon class="file-icon" :extname="att.extname.toLowerCase()" />
          <div class="file-item-body">
            <div class="file-item-name">{{ att.saveName }}</div>
            <div class="file-item-size">{{ formatFileSize(att.size) }}</div>
          </div>
          <CircleCloseFilled class="item-close-btn" @click.stop="deleteFile(index)" />
        </div>
      </div>
      <div class="question-input-textarea-container">
        <!-- 附件选择 -->
        <AppIcon name="attachment" class="attachment-btn" @click="selectAttachment()" />

        <!-- 文本域 -->
        <el-input
          ref="inputTextareaRef"
          v-model="question"
          type="textarea"
          :placeholder="$t('app.chatgpt.body.input.question.placeholder')"
          :autosize="{ minRows: 1, maxRows: 8 }"
          resize="none"
          @keydown.enter="sendQuestion"
          @paste="handleInputPaste"
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
      :class="{
        'question-input-btn-available': question.trim().length > 0 && !appStateStore.uploading
      }"
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

    .question-input-file-list {
      box-sizing: border-box;
      padding: $app-padding-small $app-padding-small 0 $app-padding-small;
      display: flex;
      gap: $app-padding-small;
      flex-wrap: wrap;

      .image-item {
        height: $app-chatgpt-input-image-height;
        width: $app-chatgpt-input-image-height;
        position: relative;

        .item-image {
          height: 100%;
          width: 100%;
          border-radius: $app-border-radius-base;
          cursor: pointer;
        }

        .item-close-btn {
          height: $app-icon-size-small;
          width: $app-icon-size-small;
          position: absolute;
          top: calc($app-icon-size-small / -2);
          right: calc($app-icon-size-small / -2);
          cursor: pointer;
        }
      }

      .file-item {
        height: $app-chatgpt-input-file-height;
        box-sizing: border-box;
        padding: $app-padding-small;
        background-color: var(--el-fill-color-darker);
        border-radius: $app-border-radius-base;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $app-padding-extra-small;
        cursor: pointer;

        .item-close-btn {
          height: $app-icon-size-small;
          width: $app-icon-size-small;
          position: absolute;
          top: calc($app-icon-size-small / -2);
          right: calc($app-icon-size-small / -2);
          cursor: pointer;
        }

        .file-icon {
          flex-shrink: 0;
          height: 100%;
        }

        .file-item-body {
          height: 100%;
          min-width: 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .file-item-name {
            font-size: var(--el-font-size-base);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .file-item-size {
            font-size: var(--el-font-size-small);
            color: var(--el-text-color-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
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
