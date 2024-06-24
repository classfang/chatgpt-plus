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
  internetSearchOption: InternetSearchOption
) => {
  if (functionName === ToolEnum.INTERNET_SEARCH) {
    const resp = await axios.get(internetSearchOption.google.baseUrl, {
      params: {
        key: internetSearchOption.google.key,
        cx: internetSearchOption.google.cx,
        q: JSON.parse(functionArguments).query
      }
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
