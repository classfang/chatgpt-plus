<script setup lang="ts">
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { renderMarkdown } from '@renderer/utils/markdown-util'

// 仓库
const appStateStore = useAppStateStore()
const chatSessionStore = useChatSessionStore()

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-assistant">
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
    <div class="message-console"></div>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-assistant {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $app-padding-small;

  .message-content {
    min-width: 4rem;
    max-width: 80%;
    flex: 1 1 0;
    white-space: pre-wrap;
    line-break: anywhere;
    background-color: var(--el-fill-color);
    box-sizing: border-box;
    padding: $app-padding-small $app-padding-base;
    border-radius: calc(1.5rem / 2 + $app-padding-small);
    line-height: 1.5rem;
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
    height: $app-chatgpt-message-console-height;
  }
}
</style>
