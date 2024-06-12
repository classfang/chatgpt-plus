<script setup lang="ts">
import { Bottom } from '@element-plus/icons-vue'
import ChatGPTMessageAssistant from '@renderer/components/ChatGPTMessageAssistant.vue'
import ChatGPTMessageError from '@renderer/components/ChatGPTMessageError.vue'
import ChatGPTMessageUser from '@renderer/components/ChatGPTMessageUser.vue'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { ref, nextTick, reactive, toRefs, onMounted } from 'vue'

// 仓库
const chatSessionStore = useChatSessionStore()

// 数据绑定
const data = reactive({
  toBottomBtnVisible: false
})
const { toBottomBtnVisible } = toRefs(data)

// ref
const messageListScrollbarRef = ref()

// 滚动到底部
const scrollToBottom = (isAuto: boolean) => {
  nextTick(() => {
    if (!isAuto || !data.toBottomBtnVisible) {
      messageListScrollbarRef.value.setScrollTop(messageListScrollbarRef.value.wrapRef.scrollHeight)
    }
  })
}

// 监听消息列表滚动
const onMessageListScroll = () => {
  calcToBottomBtnVisible()
}

// 计算置底按钮是否显示
const calcToBottomBtnVisible = () => {
  // 滚动超过一定高度时，显示置底按钮
  data.toBottomBtnVisible =
    messageListScrollbarRef.value.wrapRef.scrollHeight -
      messageListScrollbarRef.value.wrapRef.clientHeight -
      messageListScrollbarRef.value.wrapRef.scrollTop >
    1
}

// 暴露方法
defineExpose({
  scrollToBottom
})

onMounted(() => {
  scrollToBottom(true)
})
</script>

<template>
  <div class="chatgpt-body-message-list">
    <el-scrollbar ref="messageListScrollbarRef" height="100%" @scroll="onMessageListScroll">
      <div class="message-list-container">
        <template v-for="m in chatSessionStore.getActiveSession!.messages" :key="m.id">
          <!-- 对话消息 -->
          <template v-if="m.type === 'chat'">
            <template v-if="m.role === 'user'">
              <ChatGPTMessageUser :message="m" />
            </template>
            <template v-else-if="m.role === 'assistant'">
              <ChatGPTMessageAssistant :message="m" />
            </template>
          </template>

          <!-- 错误消息 -->
          <template v-else-if="m.type === 'error'">
            <ChatGPTMessageError :message="m" />
          </template>

          <!-- 分隔消息 -->
          <template v-else-if="m.type === 'separator'"> </template>
        </template>
      </div>
    </el-scrollbar>

    <!-- 置底按钮 -->
    <Bottom v-if="toBottomBtnVisible" class="to-bottom-btn" @click="scrollToBottom(false)" />
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-message-list {
  min-height: 0;
  width: 100%;
  flex: 1 1 0;
  position: relative;

  .message-list-container {
    width: 100%;
    box-sizing: border-box;
    padding: 0 $app-padding-base;
    display: flex;
    flex-direction: column;
    gap: $app-padding-base;
  }

  .to-bottom-btn {
    background-color: var(--el-fill-color-darker);
    border: 1px solid var(--el-border-color);
    height: $app-icon-size-base;
    width: $app-icon-size-base;
    border-radius: 50%;
    padding: $app-padding-small;
    position: absolute;
    left: 50%;
    bottom: $app-padding-base;
    transform: translateX(-50%);
  }
}
</style>
