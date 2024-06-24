import { generateUUID } from '@renderer/utils/id-util'
import { saveFileByBase64 } from '@renderer/utils/ipc-util'
import { Logger } from '@renderer/utils/logger'
import axios from 'axios'
import dayjs from 'dayjs'
import OpenAI from 'openai'

// 所有工具
export enum ToolEnum {
  TEXT_TO_IMAGE = 'text_to_image',
  INTERNET_SEARCH = 'internet_search'
}

// 工具定义
export const toolsDefine: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: ToolEnum.TEXT_TO_IMAGE,
      description: 'Generate images from text description',
      parameters: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            description: 'Image description'
          }
        },
        required: ['description']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: ToolEnum.INTERNET_SEARCH,
      description: 'Get search result from internet',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: `What to search for. Note that today's date is ${dayjs().format('YYYY-MM-DD')}, please describe the time in the question, specific to the date.`
          }
        },
        required: ['query']
      }
    }
  }
]

// 获取需要的工具定义
export const getToolsDefine = (
  toolNameList: ToolEnum[]
): OpenAI.Chat.Completions.ChatCompletionTool[] => {
  return toolsDefine.filter((tool) => toolNameList.includes(tool.function.name as ToolEnum))
}

// 执行工具
export const toolsUse = async (
  functionName: string,
  functionArguments: string,
  abortCtrSignal: AbortSignal,
  chatSession: ChatSession,
  appSettingStore: any
) => {
  if (functionName === ToolEnum.TEXT_TO_IMAGE) {
    // OpenAI实例
    const openai = new OpenAI({
      apiKey: appSettingStore.openAI.apiKey,
      baseURL: appSettingStore.openAI.baseUrl,
      dangerouslyAllowBrowser: true
    })

    // OpenAI 绘画
    const imagesResponse = await openai.images.generate(
      {
        prompt: JSON.parse(functionArguments).description,
        response_format: 'b64_json',
        model: chatSession.textToImageOption.model,
        n: chatSession.textToImageOption.n,
        quality: chatSession.textToImageOption.quality,
        size: chatSession.textToImageOption.size,
        style: chatSession.textToImageOption.style
      },
      {
        signal: abortCtrSignal
      }
    )
    Logger.info('toolsUse text_to_image resp: ', imagesResponse)

    // 获取图片地址
    const images: ChatMessageFile[] = []
    if (imagesResponse.data) {
      // 保存图片
      for (const imgData of imagesResponse.data) {
        const extname = '.png'
        const name = `${generateUUID()}${extname}`
        const path = await saveFileByBase64(imgData.b64_json!, name)
        images.push({
          name,
          extname,
          path
        })
      }
    }

    Logger.info('toolsUse text_to_image save result: ', images)
    return JSON.stringify(images)
  } else if (functionName === ToolEnum.INTERNET_SEARCH) {
    const internetSearchOption = appSettingStore.internetSearchOption
    const resp = await axios.get(internetSearchOption.google.baseUrl, {
      params: {
        key: internetSearchOption.google.key,
        cx: internetSearchOption.google.cx,
        q: JSON.parse(functionArguments).query
      },
      signal: abortCtrSignal
    })
    Logger.info('toolsUse internet_search resp: ', resp)
    return JSON.stringify(
      resp.data.items.map((item) => ({
        title: item.title,
        snippet: item.snippet
      }))
    )
  }
  return ''
}
