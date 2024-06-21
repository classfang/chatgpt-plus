<script setup lang="ts">
import chatgptAvatar from '@renderer/assets/image/chatgpt-avatar.png'
import ChatGPTMessageConsole from '@renderer/components/message/ChatGPTMessageConsole.vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { renderMarkdown } from '@renderer/utils/markdown-util'

// 仓库
const appStateStore = useAppStateStore()
const chatSessionStore = useChatSessionStore()

// 定义事件
const emits = defineEmits(['regenerate'])

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-assistant">
    <el-avatar :size="38" :src="chatgptAvatar" />
    <div class="message-content-container">
      <div
        class="message-content select-text"
        v-html="
          renderMarkdown(
            message.content,
            chatSessionStore.getActiveSession?.messages.at(-1)?.id === message.id &&
              appStateStore.chatgptLoading
          )
        "
      ></div>
      <ChatGPTMessageConsole
        v-model:message="message"
        class="message-console"
        @regenerate="emits('regenerate')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-assistant {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: $app-padding-small;

  .message-content-container {
    min-width: 0;
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $app-padding-extra-small;

    .message-content {
      min-width: 4rem;
      max-width: 80%;
      flex: 1 1 0;
      white-space: pre-wrap;
      line-break: anywhere;
      background-color: var(--el-fill-color);
      box-sizing: border-box;
      padding: $app-padding-small;
      border-radius: calc(1.5rem / 2 + $app-padding-small);
      line-height: $app-line-height-base;
      display: flex;
      flex-direction: column;

      :deep(p) {
        margin-block: 0;
        margin: 0; // markerdown 中 p 标签去除外边距，防止消息框撑开太多
      }

      :deep(li) {
        white-space: normal; // 防止列表的 marker 和内容之间存在换行
      }

      :deep(.chat-message-loading) {
        font-weight: 500;
        color: var(--el-color-primary);
        animation: alternate-hide-show 900ms ease-in-out infinite;
      }

      @keyframes alternate-hide-show {
        0%,
        50%,
        100% {
          opacity: 1;
        }
        60%,
        90% {
          opacity: 0;
        }
      }
    }

    .message-console {
      opacity: 0;
      transition: opacity $app-transition-base;
    }

    &:hover {
      .message-console {
        opacity: 1;
      }
    }
  }
}
</style>