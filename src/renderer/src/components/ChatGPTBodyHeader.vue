<script setup lang="ts">
import { ArrowDownBold, Setting } from '@element-plus/icons-vue'
import ChatGPTBodySetting from '@renderer/components/ChatGPTBodySetting.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { reactive, toRefs } from 'vue'

// 数据绑定
const data = reactive({
  currentChatSettingVisible: false
})
const { currentChatSettingVisible } = toRefs(data)

// 仓库
const chatSessionStore = useChatSessionStore()
const appSettingStore = useAppSettingStore()
const appStateStore = useAppStateStore()
</script>

<template>
  <div
    class="chatgpt-body-header"
    :class="{
      'chatgpt-body-header-sidebar-header-placeholder': !appSettingStore.chatgpt.sidebarVisible
    }"
  >
    <!-- 模型名称下拉列表 -->
    <el-dropdown trigger="click" :disabled="appStateStore.chatgptLoading" placement="bottom-start">
      <div class="model-name">
        <div>{{ chatSessionStore.getActiveSession!.model }}</div>
        <ArrowDownBold class="session-setting-icon" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="Setting" @click="currentChatSettingVisible = true">
            {{ $t('app.chatgpt.body.header.currentChat.setting') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

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
    cursor: pointer;

    .session-setting-icon {
      height: $app-icon-size-small;
      width: $app-icon-size-small;
    }
  }
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  padding: $app-padding-base;
}
</style>
