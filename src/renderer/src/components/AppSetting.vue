<script setup lang="ts">
import { useAppSettingStore } from '@renderer/store/app-setting'
import { setProxy } from '@renderer/utils/ipc-util'

// 组件传参
const visible = defineModel<boolean>('visible', {
  default: () => false
})

// 仓库
const appSettingStore = useAppSettingStore()
</script>

<template>
  <div class="app-setting">
    <el-dialog v-model="visible" :title="$t('app.setting.title')" width="700">
      <div class="dialog-body">
        <el-tabs tab-position="left">
          <el-tab-pane :label="$t('app.setting.appearance')">
            <el-form label-width="auto">
              <!-- 主题 -->
              <el-form-item :label="$t('app.setting.item.theme.label')">
                <el-radio-group v-model="appSettingStore.app.themeModel" size="small">
                  <el-radio-button :label="$t('app.setting.item.theme.auto')" :value="0" />
                  <el-radio-button :label="$t('app.setting.item.theme.light')" :value="1" />
                  <el-radio-button :label="$t('app.setting.item.theme.dark')" :value="2" />
                </el-radio-group>
              </el-form-item>

              <!-- 语言 -->
              <el-form-item :label="$t('app.setting.item.language.label')">
                <el-radio-group v-model="appSettingStore.app.locale" size="small">
                  <el-radio-button :label="$t('app.setting.item.language.zhCN')" value="zh_CN" />
                  <el-radio-button :label="$t('app.setting.item.language.enUS')" value="en_US" />
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('app.setting.network')">
            <!-- 网络代理 -->
            <el-form-item :label="$t('app.setting.item.proxy.label')">
              <el-input
                v-model="appSettingStore.app.proxy"
                size="small"
                @change="setProxy(appSettingStore.app.proxy)"
              />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('app.setting.openai')"></el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.app-setting {
  .dialog-body {
    height: 400px;

    .el-tabs--right,
    .el-tabs__content,
    .el-tabs--left,
    .el-tabs__content {
      height: 100%;
    }
  }
}
</style>
