<script setup lang="ts">
import { ChatDotSquare } from '@element-plus/icons-vue'
import { useChatMemoryStore } from '@renderer/store/chat-memory'
import { reactive, toRefs } from 'vue'

// 仓库
const chatMemoryStore = useChatMemoryStore()

// 数据绑定
const data = reactive({
  dialogVisible: false
})
const { dialogVisible } = toRefs(data)
</script>

<template>
  <el-button :icon="ChatDotSquare" @click="dialogVisible = true">
    {{ $t('app.setting.item.memory.manage') }}
  </el-button>

  <el-dialog v-model="dialogVisible" :title="$t('app.setting.item.memory.manage')" width="700">
    <div class="dialog-body"></div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog-body {
  height: $app-dialog-height;
}
</style>
