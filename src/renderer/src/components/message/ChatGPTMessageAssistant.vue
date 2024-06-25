<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
import chatgptAvatar from '@renderer/assets/image/chatgpt-avatar.png'
import ChatGPTMessageConsole from '@renderer/components/message/ChatGPTMessageConsole.vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { downloadFile } from '@renderer/utils/download-util'
import { renderMarkdown } from '@renderer/utils/markdown-util'
import { join } from '@renderer/utils/path-util'

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
      <div class="message-content">
        <div
          class="markdown-html select-text"
          v-html="
            renderMarkdown(
              message.content,
              chatSessionStore.getActiveSession?.messages.at(-1)?.id === message.id &&
                appStateStore.chatgptLoading
            )
          "
        ></div>

        <!-- 图片列表 -->
        <div v-if="message.images && message.images.length > 0" class="file-list">
          <template v-for="(att, index) in message.images" :key="att.saveName">
            <el-dropdown trigger="contextmenu">
              <div class="image-item">
                <el-image
                  class="item-image"
                  :src="`file://${join(appStateStore.cachePath, att.saveName)}`"
                  :preview-src-list="
                    message.images.map((a) => `file://${join(appStateStore.cachePath, a.saveName)}`)
                  "
                  :initial-index="index"
                  fit="cover"
                />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :icon="Download"
                    @click="
                      downloadFile(
                        `file://${join(appStateStore.cachePath, att.saveName)}`,
                        att.name
                      )
                    "
                    >{{ $t('app.chatgpt.body.message.download') }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </div>

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
      background-color: var(--el-fill-color);
      box-sizing: border-box;
      padding: $app-padding-small;
      border-radius: calc($app-line-height-base / 2 + $app-padding-extra-small);
      display: flex;
      flex-direction: column;
      gap: $app-padding-extra-small;

      .markdown-html {
        white-space: pre-wrap;
        line-break: anywhere;
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
          font-weight: var(--el-font-weight-primary);
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

      .file-list {
        display: flex;
        gap: $app-padding-small;
        flex-wrap: wrap;

        .image-item {
          height: $app-chatgpt-message-image-height;
          width: $app-chatgpt-message-image-height;
          position: relative;
          cursor: pointer;

          .item-image {
            height: 100%;
            width: 100%;
            border-radius: $app-border-radius-base;
          }
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
