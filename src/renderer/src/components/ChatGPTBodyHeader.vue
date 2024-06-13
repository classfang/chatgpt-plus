<script setup lang="ts">
import { OpenAIModels } from '@renderer/config/OpenAIConfig'
import { useChatSessionStore } from '@renderer/store/chat-session'

// 仓库
const chatSessionStore = useChatSessionStore()
</script>

<template>
  <div class="chatgpt-body-header">
    <el-select v-model="chatSessionStore.getActiveSession!.model" allow-create filterable>
      <el-option-group v-for="group in OpenAIModels" :key="group.label" :label="group.label">
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-option-group>
    </el-select>
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
  justify-content: space-between;
  gap: $app-padding-base;
  background-color: red;
}
</style>
