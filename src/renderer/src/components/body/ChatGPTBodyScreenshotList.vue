<script setup lang="ts">
import { getDesktopScreenshots } from '@renderer/service/ipc-service'
import { Logger } from '@renderer/utils/logger'
import { onMounted, reactive, toRefs } from 'vue'

// 数据绑定
const data = reactive({
  screenshotList: [] as DesktopScreenshot[]
})
const { screenshotList } = toRefs(data)

// 定义事件
const emits = defineEmits(['select-screenshot'])

// 挂载完毕（配合 el-dialog 的 destroy-on-close）
onMounted(() => {
  // 获取屏幕截图
  getDesktopScreenshots()
    .then((sources) => {
      data.screenshotList = sources
    })
    .catch((error) => {
      Logger.error('openScreenshotsDialog error: ', error)
    })
})
</script>

<template>
  <div class="chatgpt-screenshot-list">
    <div v-for="s in screenshotList" :key="s.id" @click="emits('select-screenshot', s)">
      {{ s.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.chatgpt-screenshot-list {
  height: $app-dialog-height;
}
</style>
