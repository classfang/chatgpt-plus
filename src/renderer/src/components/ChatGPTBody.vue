<script setup lang="ts">
import ChatGPTBodyHeader from '@renderer/components/ChatGPTBodyHeader.vue'
import ChatGPTBodyInput from '@renderer/components/ChatGPTBodyInput.vue'
import ChatGPTBodyMessageList from '@renderer/components/ChatGPTBodyMessageList.vue'
</script>

<template>
  <div class="chatgpt-body">
    <!-- 头部 -->
    <ChatGPTBodyHeader />
    <!-- 消息列表 -->
    <ChatGPTBodyMessageList />
    <!-- 输入区域 -->
    <ChatGPTBodyInput />
  </div>
</template>

<style lang="scss">
.chatgpt-body {
  height: 100%;
  min-width: 0;
  background-color: var(--el-fill-color-extra-light);
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
}
</style>
