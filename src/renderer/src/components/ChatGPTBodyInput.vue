<script setup lang="ts">
import { Top } from '@element-plus/icons-vue'
import { reactive, toRefs } from 'vue'

// 数据绑定
const data = reactive({
  question: ''
})
const { question } = toRefs(data)
</script>

<template>
  <div class="chatgpt-body-input">
    <el-input
      v-model="question"
      size="large"
      :placeholder="$t('app.chatgpt.body.input.question.placeholder')"
      class="question-input"
    >
      <template #suffix>
        <el-button circle :icon="Top" class="question-input-btn"> </el-button>
      </template>
    </el-input>
  </div>
</template>

<style lang="scss">
.chatgpt-body-input {
  width: 100%;
  box-sizing: border-box;
  padding: $app-padding-base;

  .question-input {
    .el-input__wrapper {
      border-radius: var(--el-border-radius-round);
      box-shadow: none;
      background-color: var(--el-fill-color-light);
    }

    .question-input-btn {
      border: none;
      background-color: var(--el-fill-color);
    }
  }
}
</style>
