<script setup lang="ts">
import ChatGPTBody from '@renderer/components/ChatGPTBody.vue'
import ChatGPTSidebar from '@renderer/components/ChatGPTSidebar.vue'
</script>

<template>
  <div class="chatgpt">
    <ChatGPTSidebar />
    <ChatGPTBody />
  </div>
</template>

<style lang="scss">
.chatgpt {
  min-height: 0;
  width: 100%;
  flex: 1 1 0;
  display: flex;
}
</style>
