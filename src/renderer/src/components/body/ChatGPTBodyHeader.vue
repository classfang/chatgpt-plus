<script setup lang="ts">
import { Picture, Share, Document } from '@element-plus/icons-vue'
import ChatGPTBodySetting from '@renderer/components/body/ChatGPTBodySetting.vue'
import AppIcon from '@renderer/components/icon/AppIcon.vue'
import AppSetting from '@renderer/components/setting/AppSetting.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { nowTimestamp } from '@renderer/utils/date-util'
import { exportTextFile } from '@renderer/utils/download-util'
import { Logger } from '@renderer/utils/logger'
import { ElMessageBox } from 'element-plus'
import html2canvas from 'html2canvas'
import { reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

// 数据绑定
const data = reactive({
  currentChatSettingVisible: false
})
const { currentChatSettingVisible } = toRefs(data)

// 仓库
const chatSessionStore = useChatSessionStore()
const appSettingStore = useAppSettingStore()
const appStateStore = useAppStateStore()

// 分享图片
const shareImage = () => {
  if (appStateStore.chatgptLoading) {
    return
  }

  const el = document.getElementById('message-list-container')
  if (el) {
    ElMessageBox.confirm(
      t('app.chatgpt.body.header.share.image.content'),
      t('app.chatgpt.body.header.share.image.title'),
      {
        distinguishCancelAndClose: true,
        confirmButtonText: t('app.chatgpt.body.header.share.image.confirm'),
        cancelButtonText: t('app.chatgpt.body.header.share.image.cancel')
      }
    ).then(() => {
      html2canvas(el, {
        // 缩放比例,默认为1
        scale: 2,
        // 是否允许跨域图像污染画布
        allowTaint: true,
        // 是否尝试使用CORS从服务器加载图像
        useCORS: true
      })
        .then((canvas) => {
          // 将图片下载到本地
          const a = document.createElement('a')
          a.download = `share-image-${nowTimestamp()}`
          a.href = canvas.toDataURL('image/png')
          a.dispatchEvent(new MouseEvent('click'))
        })
        .catch((e: any) => {
          Logger.error(e.message)
        })
    })
  }
}

// 分享文本
const shareText = () => {
  if (appStateStore.chatgptLoading) {
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
      const exportText = messages.map((m) => `#### ${m.role}: \n${m.content}\n\n---\n\n`).join('')

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
    <div class="model-name" @click="currentChatSettingVisible = true">
      <div>{{ chatSessionStore.getActiveSession!.chatOption.model }}</div>
      <AppIcon name="arrow-down" class="model-name-icon" />
    </div>

    <!-- 联网开关 -->
    <el-tooltip
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
        class="net-icon"
        @click="
          chatSessionStore.getActiveSession!.internetSearchOption.enabled =
            !chatSessionStore.getActiveSession!.internetSearchOption.enabled
        "
      />
    </el-tooltip>

    <!-- 分享下拉列表 -->
    <el-dropdown
      class="share-dropdown"
      trigger="click"
      :disabled="appStateStore.chatgptLoading"
      placement="bottom-start"
    >
      <Share class="share-icon" />
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

    <!-- 应用设置 -->
    <AppSetting />

    <!-- 当前对话设置弹窗 -->
    <ChatGPTBodySetting v-model:visible="currentChatSettingVisible" />
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
    color: var(--el-text-color-secondary);
    transition: color $app-transition-base;
    cursor: pointer;

    &:hover {
      color: var(--el-text-color-primary);
    }

    .model-name-icon {
      height: $app-icon-size-base;
      width: $app-icon-size-base;
    }
  }

  .net-icon {
    margin-left: auto;
    height: $app-icon-size-base;
    width: $app-icon-size-base;
    color: var(--el-text-color-secondary);
    transition: color $app-transition-base;
    cursor: pointer;
    outline: none;

    &:hover {
      color: var(--el-text-color-primary);
    }
  }

  .share-dropdown {
    .share-icon {
      height: $app-icon-size-base;
      width: $app-icon-size-base;
      outline: none;
      color: var(--el-text-color-secondary);
      transition: color $app-transition-base;
      cursor: pointer;

      &:hover {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
