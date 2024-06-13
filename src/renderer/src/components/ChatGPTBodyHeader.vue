<script setup lang="ts">
import { ArrowDownBold, Share } from '@element-plus/icons-vue'
import ChatGPTBodySetting from '@renderer/components/ChatGPTBodySetting.vue'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { useAppStateStore } from '@renderer/store/app-state'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { nowTimestamp } from '@renderer/utils/date-util'
import { Logger } from '@renderer/utils/logger'
import html2canvas from 'html2canvas'
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

// 分享
const share = () => {
  if (appStateStore.chatgptLoading) {
    return
  }

  const el = document.getElementById('message-list-container')
  if (el) {
    html2canvas(el, {
      scale: 2, // 缩放比例,默认为1
      allowTaint: true, // 是否允许跨域图像污染画布
      useCORS: true // 是否尝试使用CORS从服务器加载图像
    })
      .then((canvas) => {
        // 将图片下载到本地
        const a = document.createElement('a') // 生成一个a元素
        a.download = `share-${nowTimestamp()}` // 设置图片名称没有设置则为默认
        a.href = canvas.toDataURL('image/png') // 将生成的URL设置为a.href属性
        a.dispatchEvent(new MouseEvent('click')) // 触发a的单击事件
      })
      .catch((e: any) => {
        Logger.error(e.message)
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
      <div>{{ chatSessionStore.getActiveSession!.model }}</div>
      <ArrowDownBold class="session-setting-icon" />
    </div>

    <Share class="share-icon" @click="share()" />

    <!-- 模型名称下拉列表 -->
    <!--        <el-dropdown trigger="click" :disabled="appStateStore.chatgptLoading" placement="bottom-start">-->
    <!--          <div class="model-name" @click="currentChatSettingVisible = true">-->
    <!--            <div>{{ chatSessionStore.getActiveSession!.model }}</div>-->
    <!--            <ArrowDownBold class="session-setting-icon" />-->
    <!--          </div>-->
    <!--          <template #dropdown>-->
    <!--            <el-dropdown-menu>-->
    <!--              <el-dropdown-item :icon="Setting" @click="currentChatSettingVisible = true">-->
    <!--                {{ $t('app.chatgpt.body.header.currentChat.setting') }}-->
    <!--              </el-dropdown-item>-->
    <!--            </el-dropdown-menu>-->
    <!--          </template>-->
    <!--        </el-dropdown>-->

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

  .share-icon {
    height: $app-icon-size-base;
    width: $app-icon-size-base;
    margin-left: auto;
  }
}

//.dropdown-menu {
//  display: flex;
//  flex-direction: column;
//  padding: $app-padding-base;
//}
</style>
