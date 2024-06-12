<script setup lang="ts">
import ChatGPTBodyHeader from '@renderer/components/ChatGPTBodyHeader.vue'
</script>

<template>
  <div class="chatgpt-body">
    <!-- 头部 -->
    <ChatGPTBodyHeader />
  </div>
</template>

<style lang="scss">
.chatgpt-body {
  height: 100%;
  min-width: 0;
  background-color: var(--el-fill-color-lighter);
  flex-grow: 1;
  flex-direction: column;
}
</style>
