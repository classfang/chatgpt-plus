// https://platform.openai.com/docs/models
export const OpenAIModels = [
  {
    label: 'GPT-4o',
    options: [
      {
        value: 'gpt-4o',
        label: 'gpt-4o'
      }
    ]
  },
  {
    label: 'GPT-4 Turbo and GPT-4',
    options: [
      {
        value: 'gpt-4-turbo',
        label: 'gpt-4-turbo'
      },
      {
        value: 'gpt-4-turbo-preview',
        label: 'gpt-4-turbo-preview'
      },
      {
        value: 'gpt-4',
        label: 'gpt-4'
      }
    ]
  },
  {
    label: 'GPT-3.5 Turbo',
    options: [
      {
        value: 'gpt-3.5-turbo',
        label: 'gpt-3.5-turbo'
      },
      {
        value: 'gpt-3.5-turbo-instruct',
        label: 'gpt-3.5-turbo-instruct'
      }
    ]
  }
]

export const OpenAISpeechModels = [
  {
    label: 'tts-1',
    options: [
      {
        value: 'tts-1',
        label: 'tts-1'
      },
      {
        value: 'tts-1-hd',
        label: 'tts-1-hd'
      }
    ]
  }
]

export const OpenAISpeechVoices = [
  {
    value: 'alloy',
    label: 'alloy'
  },
  {
    value: 'echo',
    label: 'echo'
  },
  {
    value: 'fable',
    label: 'fable'
  },
  {
    value: 'onyx',
    label: 'onyx'
  },
  {
    value: 'nova',
    label: 'nova'
  },
  {
    value: 'shimmer',
    label: 'shimmer'
  }
]
