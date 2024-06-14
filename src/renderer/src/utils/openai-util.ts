import { Logger } from '@renderer/utils/logger'
import OpenAI from 'openai'

export interface OpenAIChatParam {
  baseURL: string
  apiKey: string
  params: OpenAI.ChatCompletionCreateParams
  abortCtrSignal?: AbortSignal
  answer?: (content: string) => void
  end?: () => void
  error?: (error: any) => void
}

// 对话
export const openaiChat = async (param: OpenAIChatParam) => {
  try {
    // OpenAI实例
    const openai = new OpenAI({
      baseURL: param.baseURL,
      apiKey: param.apiKey,
      dangerouslyAllowBrowser: true
    })

    Logger.info('openai chat request params: ', param.params)

    // 流式对话
    if (param.params.stream) {
      const stream = await openai.chat.completions.create(param.params, {
        signal: param.abortCtrSignal
      })

      // 连续回答
      for await (const chunk of stream) {
        if (param.abortCtrSignal?.aborted) {
          return
        }
        Logger.info('openai chat response chunk: ', chunk)
        param.answer && param.answer(chunk.choices[0].delta.content ?? '')
      }
    } else {
      const completion = await openai.chat.completions.create(param.params)

      // 一次性回答
      Logger.info('openai chat response completion: ', completion)
      param.answer && param.answer(completion.choices[0].message.content ?? '')
    }
  } catch (e: any) {
    Logger.info('openai chat error: ', e.message)
    param.error && param.error(e)
  }

  param.end && param.end()
}
