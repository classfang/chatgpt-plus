<script setup lang="ts">
// 组件传参
import { Download } from '@element-plus/icons-vue'
import ChatGPTMessageConsole from '@renderer/components/ChatGPTMessageConsole.vue'
import { downloadFile } from '@renderer/utils/download-util'

const message = defineModel<ChatMessage>('message', {
  default: () => {}
})
</script>

<template>
  <div class="chatgpt-message-user">
    <div class="message-content select-text">
      <span>{{ message.content }}</span>
      <div v-if="message.images && message.images.length > 0" class="file-list">
        <div v-for="(att, index) in message.images" :key="att.path" class="file-item">
          <el-dropdown trigger="contextmenu">
            <el-image
              class="item-image"
              :src="`file://${att.path}`"
              :preview-src-list="message.images.map((a) => `file://${a.path}`)"
              :initial-index="index"
              fit="cover"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :icon="Download"
                  @click="downloadFile(`file://${att.path}`, att.name)"
                  >{{ $t('app.chatgpt.body.message.download') }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <ChatGPTMessageConsole v-model:message="message" class="message-console" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-message-user {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $app-padding-small;

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
    line-height: 1.3rem;
    display: flex;
    flex-direction: column;
    gap: $app-padding-small;

    .file-list {
      display: flex;
      gap: $app-padding-small;
      flex-wrap: wrap;

      .file-item {
        height: 60px;
        width: 60px;
        position: relative;

        .item-image {
          height: 60px;
          width: 60px;
          border-radius: $app-border-radius-base;
          cursor: pointer;
        }
      }
    }
  }

  .message-console {
    opacity: 0;
    transition: opacity $app-transition-base;
    justify-content: flex-end;
  }

  &:hover {
    .message-console {
      opacity: 1;
    }
  }
}
</style>
