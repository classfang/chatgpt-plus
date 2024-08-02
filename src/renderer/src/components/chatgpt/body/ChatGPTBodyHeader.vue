<script setup lang="ts">
import { Picture, Share, Document } from '@element-plus/icons-vue'
import ChatGPTBodySetting from '@renderer/components/chatgpt/body/ChatGPTBodySetting.vue'
import ChatGPTBodyShareView from '@renderer/components/chatgpt/body/ChatGPTBodyShareView.vue'
import ChatGPTBodyStatistic from '@renderer/components/chatgpt/body/ChatGPTBodyStatistic.vue'
import AppIcon from '@renderer/components/icon/AppIcon.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { nowTimestamp } from '@renderer/utils/date-util'
import { exportTextFile } from '@renderer/utils/download-util'
import { ElMessageBox } from 'element-plus'
import { reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

// 数据绑定
const data = reactive({
  currentChatSettingVisible: false,
  currentChatStatisticVisible: false,
  shareViewVisible: false
})
const { currentChatSettingVisible, currentChatStatisticVisible, shareViewVisible } = toRefs(data)

// 仓库
const chatSessionStore = useChatSessionStore()
const appSettingStore = useAppSettingStore()
const appStateStore = useAppStateStore()

// 分享图片
const shareImage = () => {
  if (appStateStore.chatgptLoadingFlag) {
    return
  }

  data.shareViewVisible = true
}

// 分享文本
const shareText = () => {
  if (appStateStore.chatgptLoadingFlag) {
    return
  }

  const messages = chatSessionStore.getActiveSession?.messages
  if (messages && messages.length > 0) {
    ElMessageBox.confirm(
      t('app.chatgpt.body.header.share.text.content'),
      t('app.chatgpt.body.header.share.text.title'),
      {
        distinguishCancelAndClose: true,
        confirmButtonText: t('app.chatgpt.body.header.share.text.confirm'),
        cancelButtonText: t('app.chatgpt.body.header.share.text.cancel')
      }
    ).then(() => {
      // 生成导出文本（使用一些 Markdown 语法）
      const exportText = messages
        .map((m) => {
          if (m.type === 'divider') {
            return `${t('app.chatgpt.body.message.disconnectedContext')}\n\n---\n\n`
          } else {
            return `#### ${m.role}: \n${m.content}\n\n---\n\n`
          }
        })
        .join('')

      // 导出文本
      exportTextFile(`share-text-${nowTimestamp()}.txt`, exportText)
    })
  }
}
</script>

<template>
  <div
    class="chatgpt-body-header"
    :class="{
      'chatgpt-body-header-sidebar-header-placeholder': !appSettingStore.chatgpt.sidebarVisible
    }"
  >
    <el-tooltip :content="$t('app.chatgpt.body.header.currentChat.setting')">
      <div
        class="model-name"
        @click="
          () => {
            if (!chatSessionStore.getActiveSession!.archived) {
              currentChatSettingVisible = true
            }
          }
        "
      >
        <div>{{ chatSessionStore.getActiveSession!.chatOption.model }}</div>
        <AppIcon name="arrow-down" class="model-name-icon" />
      </div>
    </el-tooltip>

    <!-- 联网开关 -->
    <el-tooltip
      v-if="chatSessionStore.getActiveSession!.internetSearchOption"
      :content="
        chatSessionStore.getActiveSession!.internetSearchOption.enabled
          ? $t('app.chatgpt.body.header.internetSearch.turnedOn')
          : $t('app.chatgpt.body.header.internetSearch.turnedOff')
      "
      placement="bottom"
    >
      <AppIcon
        :name="
          chatSessionStore.getActiveSession!.internetSearchOption.enabled
            ? 'with-net'
            : 'without-net'
        "
        class="header-icon"
        @click="
          () => {
            if (!chatSessionStore.getActiveSession!.archived) {
              chatSessionStore.getActiveSession!.internetSearchOption.enabled =
                !chatSessionStore.getActiveSession!.internetSearchOption.enabled
            }
          }
        "
      />
    </el-tooltip>

    <!-- 分享下拉列表 -->
    <el-dropdown
      trigger="click"
      :disabled="appStateStore.chatgptLoadingFlag"
      placement="bottom-start"
    >
      <div>
        <el-tooltip :content="$t('app.chatgpt.body.header.share.title')">
          <Share class="header-icon" />
        </el-tooltip>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="Picture" @click="shareImage()">
            {{ $t('app.chatgpt.body.header.share.image.title') }}
          </el-dropdown-item>
          <el-dropdown-item :icon="Document" @click="shareText()">
            {{ $t('app.chatgpt.body.header.share.text.title') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 用量统计 -->
    <el-tooltip :content="$t('app.chatgpt.body.statistic.title')">
      <AppIcon name="usage" class="header-icon" @click="currentChatStatisticVisible = true" />
    </el-tooltip>

    <!-- 当前对话设置弹窗 -->
    <ChatGPTBodySetting v-model:visible="currentChatSettingVisible" />

    <!-- 当前对话统计弹窗 -->
    <ChatGPTBodyStatistic v-model:visible="currentChatStatisticVisible" />

    <!-- 图片分享预览弹窗 -->
    <ChatGPTBodyShareView v-model:visible="shareViewVisible" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-header {
  height: $app-chatgpt-body-header-height;
  width: 100%;
  box-sizing: border-box;
  padding: 0 $app-padding-base;
  transition: padding-left $app-transition-base;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: $app-padding-base;

  &-sidebar-header-placeholder {
    padding-left: calc($app-icon-size-base * 2 + $app-padding-base * 3);
  }

  .model-name {
    display: flex;
    gap: $app-padding-extra-small;
    align-items: center;
    justify-content: center;
    font-size: $app-icon-size-small;
    font-weight: var(--el-font-weight-primary);
    color: var(--el-text-color-regular);
    transition: color $app-transition-base;
    cursor: pointer;
    margin-right: auto;

    &:hover {
      color: var(--el-text-color-primary);
    }

    .model-name-icon {
      height: $app-icon-size-base;
      width: $app-icon-size-base;
    }
  }

  .header-icon {
    height: $app-icon-size-base;
    width: $app-icon-size-base;
    color: var(--el-text-color-regular);
    transition: color $app-transition-base;
    cursor: pointer;
    outline: none;

    &:hover {
      color: var(--el-text-color-primary);
    }
  }
}
</style>
