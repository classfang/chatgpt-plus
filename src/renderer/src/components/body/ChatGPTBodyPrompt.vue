<script setup lang="ts">
import { MoreFilled, Search } from '@element-plus/icons-vue'
import prompts from '@renderer/assets/json/prompts.json'
import { useAppSettingStore } from '@renderer/store/app-setting'
import { getRandomElements } from '@renderer/utils/array-util'
import { computed, reactive, toRefs } from 'vue'

// 仓库
const appSettingStore = useAppSettingStore()

// 事件
const emits = defineEmits(['use-prompt'])

// 数据绑定
const data = reactive({
  dialogVisible: false,
  promptKeyword: ''
})
const { dialogVisible, promptKeyword } = toRefs(data)

// 计算属性
const randomPrompts = computed(() => getRandomElements(prompts[appSettingStore.app.locale], 4))
</script>

<template>
  <div class="chatgpt-body-prompt">
    <div
      v-for="p in randomPrompts"
      :key="p[0]"
      class="fast-prompt-item"
      @click="emits('use-prompt', p[1])"
    >
      {{ p[0] }}
    </div>
    <div class="fast-prompt-item" @click="dialogVisible = true">
      <el-icon>
        <MoreFilled />
      </el-icon>
    </div>

    <el-dialog v-model="dialogVisible" :title="$t('app.chatgpt.body.prompt.title')" width="700">
      <div class="dialog-body">
        <div class="prompt-list-header">
          <div class="prompt-count">
            {{
              $t('app.chatgpt.body.prompt.count').replace(
                '_',
                String(
                  (prompts[appSettingStore.app.locale] as string[][]).filter(
                    (p) => p[0].includes(promptKeyword) || p[0].includes(promptKeyword)
                  ).length
                )
              )
            }}
          </div>
          <div class="prompt-search">
            <el-input
              v-model="promptKeyword"
              :placeholder="$t('app.chatgpt.body.prompt.search')"
              :prefix-icon="Search"
            />
          </div>
        </div>
        <div class="prompt-list">
          <el-scrollbar height="100%">
            <template v-for="p in prompts[appSettingStore.app.locale]" :key="p[0]">
              <div
                v-if="p[0].includes(promptKeyword) || p[0].includes(promptKeyword)"
                class="prompt-item"
                @click="
                  () => {
                    dialogVisible = false
                    emits('use-prompt', p[1])
                  }
                "
              >
                <div class="prompt-item-title">{{ p[0] }}</div>
                <el-text class="prompt-item-content" line-clamp="1">{{ p[1] }}</el-text>
              </div>
            </template>
          </el-scrollbar>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.chatgpt-body-prompt {
  width: 100%;
  box-sizing: border-box;
  padding: 0 $app-padding-base;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: $app-padding-base;
  font-size: var(--el-font-size-base);

  .fast-prompt-item {
    height: 30px;
    box-sizing: border-box;
    padding: 0 $app-padding-small;
    border-radius: $app-border-radius-base;
    background-color: var(--el-fill-color);
    color: var(--el-text-color-secondary);
    cursor: pointer;
    transition: all $app-transition-base;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: var(--el-fill-color-dark);
      color: var(--el-text-color);
    }
  }

  .dialog-body {
    height: $app-dialog-height;

    .prompt-list-header {
      height: 50px;
      box-sizing: border-box;
      padding: $app-padding-small;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .prompt-search {
        width: 400px;
      }

      .prompt-count {
        font-weight: var(--el-font-weight-primary);
      }
    }

    .prompt-list {
      height: calc($app-dialog-height - 50px);

      .prompt-item {
        padding: $app-padding-small;
        border-radius: $app-border-radius-base;
        cursor: pointer;
        transition: all $app-transition-base;

        &:hover {
          background-color: var(--el-fill-color-dark);
        }

        .prompt-item-title {
          font-weight: var(--el-font-weight-primary);
        }

        .prompt-item-content {
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
