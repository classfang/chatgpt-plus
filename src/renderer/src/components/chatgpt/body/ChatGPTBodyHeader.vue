<script setup lang="ts">
import ChatGPTBodySetting from '@renderer/components/chatgpt/body/ChatGPTBodySetting.vue'
import ChatGPTBodyStatistic from '@renderer/components/chatgpt/body/ChatGPTBodyStatistic.vue'
import AppIcon from '@renderer/components/icon/AppIcon.vue'
import { useStore } from '@renderer/store/store'
import { reactive, toRefs } from 'vue'

// 组件传参
const shareVisible = defineModel<boolean>('shareVisible', {
  default: () => false
})

// 数据绑定
const data = reactive({
  currentChatSettingVisible: false,
  currentChatStatisticVisible: false
})
const { currentChatSettingVisible, currentChatStatisticVisible } = toRefs(data)

// 仓库
const { chatSessionStore, appSettingStore } = useStore()
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

    <template v-if="!shareVisible">
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

      <template v-if="!chatSessionStore.getActiveSession!.new">
        <!-- 分享按钮 -->
        <el-tooltip :content="$t('app.chatgpt.body.header.share.title')">
          <AppIcon name="share" class="header-icon" @click="shareVisible = true" />
        </el-tooltip>

        <!-- 用量统计 -->
        <el-tooltip :content="$t('app.chatgpt.body.statistic.title')">
          <AppIcon name="usage" class="header-icon" @click="currentChatStatisticVisible = true" />
        </el-tooltip>
      </template>
    </template>

    <!-- 取消分享 -->
    <el-button v-else link @click="shareVisible = false">
      {{ $t('app.chatgpt.body.header.share.cancel') }}
    </el-button>

    <!-- 当前对话设置弹窗 -->
    <ChatGPTBodySetting v-model:visible="currentChatSettingVisible" />

    <!-- 当前对话统计弹窗 -->
    <ChatGPTBodyStatistic v-model:visible="currentChatStatisticVisible" />
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
