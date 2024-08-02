<script setup lang="ts">
import { reactive, toRefs } from 'vue'

// 数据绑定
const data = reactive({
  today: new Date()
})
const { today } = toRefs(data)
</script>

<template>
  <div class="ai-calendar">
    <el-calendar v-model="today" />
  </div>
</template>

<style lang="scss" scoped>
.ai-calendar {
  height: 100%;
  width: 100%;
  display: flex;

  :deep(.el-calendar) {
    display: flex;
    flex-direction: column;

    .el-calendar__header {
      border-bottom: none;
      padding: $app-padding-small 0;
    }

    .el-calendar__body {
      flex: 1 1 0;
      min-height: 0;
      padding: 0;

      .el-calendar-table {
        height: 100%;

        .el-calendar-day {
          height: 100%;
        }
      }
    }
  }
}
</style>
