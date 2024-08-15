<script setup lang="ts">
import NoteEditor from '@renderer/components/calendar/editor/NoteEditor.vue'
import { useStore } from '@renderer/store/store'
import dayjs from 'dayjs'
import { reactive, toRefs } from 'vue'

// 仓库
const { aiCalendarStore } = useStore()

// 数据绑定
const data = reactive({
  current: new Date(),
  noteDialogVisible: false,
  noteContent: ''
})
const { current, noteDialogVisible, noteContent } = toRefs(data)

// 打开备忘编辑
const openNoteDialogVisible = (dayStr: string) => {
  data.noteContent = aiCalendarStore.dayNotes[dayStr]?.content ?? ''
  data.noteDialogVisible = true
}

// 保存修改
const saveNote = () => {
  aiCalendarStore.saveNote({
    time: dayjs(data.current).format('YYYY-MM-DD'),
    content: data.noteContent
  })

  data.noteContent = ''
  data.noteDialogVisible = false
}
</script>

<template>
  <div class="ai-calendar">
    <el-calendar v-model="current">
      <template #date-cell="t">
        <div class="ai-calendar-day" @dblclick="openNoteDialogVisible(t.data.day)">
          <div class="ai-calendar-day-title">{{ dayjs(t.data.date).date() }}</div>
          <div class="ai-calendar-day-content">
            {{ aiCalendarStore.dayNotes[t.data.day]?.content }}
          </div>
        </div>
      </template>
    </el-calendar>

    <el-dialog
      v-model="noteDialogVisible"
      :title="$t('app.calendar.note.title')"
      width="700"
      align-center
      destroy-on-close
      :close-on-click-modal="false"
    >
      <div class="dialog-body">
        <el-scrollbar height="100%">
          <NoteEditor v-model:content="noteContent" :min-rows="20" />
        </el-scrollbar>
      </div>
      <template #footer>
        <el-button @click="noteDialogVisible = false">
          {{ $t('app.common.cancel') }}
        </el-button>
        <el-button type="primary" @click="saveNote()">
          {{ $t('app.common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
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

  .ai-calendar-day {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: $app-padding-extra-small;

    .ai-calendar-day-title {
      font-size: var(--el-font-size-medium);
    }

    .ai-calendar-day-content {
      flex: 1 1 0;
      min-height: 0;
      white-space: pre-wrap;
      line-break: anywhere;
      color: var(--el-text-color-secondary);
      font-size: var(--el-font-size-small);
      overflow: hidden;
    }
  }

  .dialog-body {
    height: $app-dialog-height;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
  }
}
</style>
