<script setup lang="ts">
import { Bottom } from '@element-plus/icons-vue'
import ChatGPTBodyEmpty from '@renderer/components/ChatGPTBodyEmpty.vue'
import ChatGPTMessageAssistant from '@renderer/components/ChatGPTMessageAssistant.vue'
import ChatGPTMessageError from '@renderer/components/ChatGPTMessageError.vue'
import ChatGPTMessageUser from '@renderer/components/ChatGPTMessageUser.vue'
import { useChatSessionStore } from '@renderer/store/chat-session'
import { ref, nextTick, reactive, toRefs, onMounted } from 'vue'

// 仓库
const chatSessionStore = useChatSessionStore()

// ref
const messageListScrollbarRef = ref()

// 定义事件
const emits = defineEmits(['regenerate'])

// 数据绑定
const data = reactive({
  toBottomBtnVisible: false
})
const { toBottomBtnVisible } = toRefs(data)

// 滚动到底部
const scrollToBottom = (isAuto: boolean) => {
  nextTick(() => {
    if (!isAuto) {
      // 当前距离底部高度
      let diffHeight =
        messageListScrollbarRef.value.wrapRef.scrollHeight -
        messageListScrollbarRef.value.wrapRef.clientHeight -
        messageListScrollbarRef.value.wrapRef.scrollTop

      // 起始步长
      let stepHeight = Math.ceil(diffHeight * 0.2)

      // 周期任务
      const interval = setInterval(() => {
        // 滚动一个步长
        messageListScrollbarRef.value?.setScrollTop(
          messageListScrollbarRef.value.wrapRef.scrollTop + stepHeight
        )

        // 修改步长
        diffHeight -= stepHeight
        stepHeight = Math.ceil(diffHeight * 0.2)

        // 判断是否到达底部
        if (diffHeight <= 0) {
          // 停止周期任务
          clearInterval(interval)

          // 保证置底
          messageListScrollbarRef.value?.setScrollTop(
            messageListScrollbarRef.value.wrapRef.scrollHeight
          )
        }
      }, 10)
    } else if (!data.toBottomBtnVisible) {
      messageListScrollbarRef.value?.setScrollTop(
        messageListScrollbarRef.value.wrapRef.scrollHeight
      )
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
    <!-- 消息列表 -->
    <el-scrollbar
      v-if="chatSessionStore.getActiveSession!.messages.length > 0"
      ref="messageListScrollbarRef"
      height="100%"
      @scroll="onMessageListScroll"
    >
      <div id="message-list-container" class="message-list-container">
        <template v-for="m in chatSessionStore.getActiveSession!.messages" :key="m.id">
          <!-- 对话消息 -->
          <template v-if="m.type === 'chat'">
            <template v-if="m.role === 'user'">
              <ChatGPTMessageUser :message="m" />
            </template>
            <template v-else-if="m.role === 'assistant'">
              <ChatGPTMessageAssistant :message="m" @regenerate="emits('regenerate', m.id)" />
            </template>
          </template>

          <!-- 错误消息 -->
          <template v-else-if="m.type === 'error'">
            <ChatGPTMessageError :message="m" @regenerate="emits('regenerate', m.id)" />
          </template>

          <!-- 分隔消息 -->
          <template v-else-if="m.type === 'separator'"> </template>
        </template>
      </div>
    </el-scrollbar>

    <!-- 空状态 -->
    <ChatGPTBodyEmpty v-else />

    <!-- 置底按钮 -->
    <transition name="el-fade-in-linear">
      <Bottom v-if="toBottomBtnVisible" class="to-bottom-btn" @click="scrollToBottom(false)" />
    </transition>
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
    background-color: var(--el-fill-color-extra-light);
    box-sizing: border-box;
    padding: $app-padding-base;
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
    padding: $app-padding-extra-small;
    position: absolute;
    left: 50%;
    bottom: $app-padding-small;
    transform: translateX(-50%);
    cursor: pointer;
  }
}
</style>
