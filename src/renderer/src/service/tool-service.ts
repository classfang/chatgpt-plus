import { Logger } from '@renderer/utils/logger'
import axios from 'axios'
import dayjs from 'dayjs'
import OpenAI from 'openai'

// 工具定义
export const toolsDefine: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'internet_search',
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

// 执行工具
export const toolsUse = async (
  functionName: string,
  functionArguments: string,
  internetSearchOption: InternetSearchOption
) => {
  if (functionName === 'internet_search') {
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
