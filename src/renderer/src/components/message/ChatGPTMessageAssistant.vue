<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
import ChatGPTMessageConsole from '@renderer/components/message/ChatGPTMessageConsole.vue'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { downloadFile } from '@renderer/utils/download-util'
import { renderMarkdown } from '@renderer/utils/markdown-util'
import { join } from '@renderer/utils/path-util'
import { openInBrowser } from '@renderer/utils/window-util'

// 仓库
const appStateStore = useAppStateStore()
const chatSessionStore = useChatSessionStore()

// 定义事件
const emits = defineEmits(['regenerate', 'clear-context'])

// 组件传参
const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-assistant">
    <div class="message-content-container">
      <div class="message-content">
        <!-- 搜索结果列表 -->
        <el-collapse
          v-if="message.searchItems && message.searchItems.length > 0"
          class="search-item-list-collapse"
        >
          <el-collapse-item
            :title="`${$t('app.chatgpt.body.message.searchResult').replace('_', String(message.searchItems.length))}`"
          >
            <div class="search-item-list">
              <template v-for="item in message.searchItems" :key="item.link">
                <div class="search-item" @click="openInBrowser(item.link)">
                  <el-text class="search-item-title" line-clamp="1">
                    {{ item.title }}
                  </el-text>
                  <div class="search-item-display-link">{{ item.displayLink }}</div>
                </div>
              </template>
            </div>
          </el-collapse-item>
        </el-collapse>

        <!-- Markdown内容 -->
        <div
          class="markdown-html select-text"
          v-html="
            renderMarkdown(
              message.content,
              chatSessionStore.getActiveSession?.messages.at(-1)?.id === message.id &&
                appStateStore.chatgptLoadingFlag
            )
          "
        ></div>

        <!-- 图片列表 -->
        <div v-if="message.images && message.images.length > 0" class="attachment-list">
          <template v-for="(att, index) in message.images" :key="att.saveName">
            <el-dropdown trigger="contextmenu">
              <div class="image-item hover-float-up">
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
                    >{{ $t('app.chatgpt.body.message.download') }}
                  </el-dropdown-item>
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
        @clear-context="emits('clear-context')"
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
      min-width: calc($app-line-height-base + $app-padding-base * 2);
      max-width: 80%;
      flex: 1 1 0;
      background-color: var(--el-fill-color);
      box-sizing: border-box;
      padding: $app-padding-small $app-padding-base;
      border-radius: calc($app-line-height-base / 2 + $app-padding-small);
      display: flex;
      flex-direction: column;
      gap: $app-padding-small;

      :deep(.markdown-html) {
        white-space: pre-wrap;
        line-break: anywhere;
        line-height: $app-line-height-base;
        display: flex;
        flex-direction: column;

        p,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        ul,
        ol {
          margin-block: 0;
        }

        p:not(:first-of-type) {
          margin-top: calc($app-line-height-base / 2);
        }

        p:not(:last-of-type) {
          margin-bottom: calc($app-line-height-base / 2);
        }

        li {
          // 防止列表的 marker 和内容之间存在换行
          white-space: normal;
        }

        .chat-message-loading {
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

      .attachment-list {
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

      .search-item-list-collapse {
        border: none;

        :deep(.el-collapse-item__header) {
          height: calc($app-line-height-base + $app-padding-small);
          padding-bottom: $app-padding-small;
          background-color: transparent;
          font-size: var(--el-font-size-base);
        }

        :deep(.el-collapse-item__wrap) {
          background-color: transparent;
        }

        .search-item-list {
          display: flex;
          flex-direction: column;
          gap: $app-padding-extra-small;
          font-size: var(--el-font-size-base);

          .search-item {
            width: 100%;
            cursor: pointer;
            transition: color $app-transition-base;
            display: flex;
            align-items: center;
            gap: $app-padding-small;

            &:hover {
              color: var(--el-color-primary);

              .search-item-title {
                color: var(--el-color-primary);
              }
            }

            .search-item-title {
              min-width: 0;
              max-width: max-content;
              flex: 1 1 0;
              transition: color $app-transition-base;
            }

            .search-item-display-link {
              color: var(--el-text-color-secondary);
            }
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
