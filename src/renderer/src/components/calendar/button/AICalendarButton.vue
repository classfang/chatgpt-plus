<script setup lang="ts">
import { Calendar } from '@element-plus/icons-vue'
import AICalendar from '@renderer/components/calendar/main/AICalendar.vue'
import { useStore } from '@renderer/store/store'
import { reactive, toRefs } from 'vue'

// 仓库
const { appStateStore } = useStore()

// 数据绑定
const data = reactive({
  drawerVisible: false
})
const { drawerVisible } = toRefs(data)
</script>

<template>
  <div>
    <el-button :icon="Calendar" plain size="small" @click="drawerVisible = true">
      {{ $t('app.calendar.title') }}
    </el-button>
    <el-drawer
      v-model="drawerVisible"
      :title="$t('app.calendar.title')"
      size="100%"
      direction="btt"
      class="ai-calendar-drawer"
      destroy-on-close
      append-to-body
    >
      <AICalendar :key="`ai-calendar-${appStateStore.dayKey}`" />
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
:deep(.ai-calendar-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
  }
}
</style>
