<script setup lang="ts">
import { Download, Folder, Monitor, Moon, Setting, Sunny, Tools } from '@element-plus/icons-vue'
import buildInfo from '@renderer/assets/json/build-info.json'
import AppIcon from '@renderer/components/AppIcon.vue'
import { OpenAIModels, OpenAISpeechModels, OpenAISpeechVoices } from '@renderer/config/OpenAIConfig'
import { useAppSettingStore } from '@renderer/store/app-setting'
import {
  getAppVersion,
  onMainWindowFocus,
  openCacheDir,
  openDevTools,
  openLogDir,
  setProxy
} from '@renderer/utils/ipc-util'
import { Logger } from '@renderer/utils/logger'
import { openInBrowser } from '@renderer/utils/window-util'
import axios from 'axios'
import dayjs from 'dayjs'
import { onMounted, reactive, toRefs } from 'vue'

// 仓库
const appSettingStore = useAppSettingStore()

// 数据绑定
const data = reactive({
  appSettingVisible: false,
  badge: {
    appVersion: false
  },
  appVersion: '0.0.0'
})
const { appSettingVisible, badge, appVersion } = toRefs(data)

// 检查新版本
const checkAppVersion = () => {
  axios
    .get('https://api.github.com/repos/classfang/chatgpt-plus/releases/latest')
    .then((response) => {
      const json = response.data
      if (json.name) {
        const appVersionArray = data.appVersion.split('.')
        const newVersionArray = json.name.split('.')
        for (let i = 0; i < newVersionArray.length; i++) {
          if (Number(newVersionArray[i]) > Number(appVersionArray[i])) {
            data.badge.appVersion = true
            break // 跳出循环，因为发现有新版本
          } else if (Number(newVersionArray[i]) < Number(appVersionArray[i])) {
            data.badge.appVersion = false
            break // 跳出循环，因为发现当前版本已经是最新的
          }
        }
      }
    })
    .catch((error) => {
      Logger.error('Error get the latest release:', error)
    })
}

onMounted(() => {
  // 获取应用版本号
  getAppVersion().then((v) => {
    data.appVersion = v
    checkAppVersion()
  })

  // 每次获得焦点检查最新版本，限制一小时内不重复检查
  let lastCheckTime = 0
  onMainWindowFocus(() => {
    if (new Date().getTime() - lastCheckTime > 1000 * 60 * 60) {
      checkAppVersion()
      lastCheckTime = new Date().getTime()
    }
  })
})
</script>

<template>
  <div class="app-setting">
    <el-badge is-dot :hidden="!badge.appVersion">
      <AppIcon name="setting" class="setting-icon" @click="appSettingVisible = true" />
    </el-badge>

    <el-dialog v-model="appSettingVisible" :title="$t('app.setting.title')" width="700">
      <div class="dialog-body">
        <el-tabs tab-position="left">
          <!-- 外观 -->
          <el-tab-pane :label="$t('app.setting.appearance')">
            <el-form label-width="auto">
              <!-- 主题 -->
              <el-form-item :label="$t('app.setting.item.theme.label')">
                <el-radio-group v-model="appSettingStore.app.themeModel">
                  <el-radio-button :value="0">
                    <el-space :size="5">
                      <Monitor class="setting-item-icon" />
                      <div>{{ $t('app.setting.item.theme.auto') }}</div>
                    </el-space>
                  </el-radio-button>
                  <el-radio-button :value="1">
                    <el-space :size="5">
                      <Sunny class="setting-item-icon" />
                      <div>{{ $t('app.setting.item.theme.light') }}</div>
                    </el-space>
                  </el-radio-button>
                  <el-radio-button :value="2">
                    <el-space :size="5">
                      <Moon class="setting-item-icon" />
                      <div>{{ $t('app.setting.item.theme.dark') }}</div>
                    </el-space>
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <!-- 语言 -->
              <el-form-item :label="$t('app.setting.item.language.label')">
                <el-radio-group v-model="appSettingStore.app.locale">
                  <el-radio-button :label="$t('app.setting.item.language.zhCN')" value="zh_CN" />
                  <el-radio-button :label="$t('app.setting.item.language.enUS')" value="en_US" />
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- OpenAI -->
          <el-tab-pane :label="$t('app.setting.openai')">
            <el-form label-width="auto">
              <!-- Base URL -->
              <el-form-item :label="$t('app.setting.item.openai.baseUrl')">
                <el-input v-model="appSettingStore.openAI.baseUrl" />
              </el-form-item>

              <!-- API Key -->
              <el-form-item :label="$t('app.setting.item.openai.apiKey')">
                <el-input v-model="appSettingStore.openAI.apiKey" show-password type="password" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 对话 -->
          <el-tab-pane :label="$t('app.setting.chat')">
            <el-form label-width="auto">
              <!-- Model -->
              <el-form-item :label="$t('app.setting.item.chat.model')">
                <el-select
                  v-model="appSettingStore.openAI.chatOption.model"
                  allow-create
                  filterable
                >
                  <el-option-group
                    v-for="group in OpenAIModels"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
              </el-form-item>

              <!-- Temperature -->
              <el-form-item :label="$t('app.setting.item.chat.temperature')">
                <el-tooltip
                  :content="$t('app.setting.item.chat.explain.temperature')"
                  placement="right"
                >
                  <el-input-number
                    v-model="appSettingStore.openAI.chatOption.temperature"
                    :min="0"
                    :max="1"
                    :step="0.1"
                  />
                </el-tooltip>
              </el-form-item>

              <!-- Top P -->
              <el-form-item :label="$t('app.setting.item.chat.topP')">
                <el-tooltip :content="$t('app.setting.item.chat.explain.topP')" placement="right">
                  <el-input-number
                    v-model="appSettingStore.openAI.chatOption.topP"
                    :min="0"
                    :max="1"
                    :step="0.1"
                  />
                </el-tooltip>
              </el-form-item>

              <!-- Max Tokens -->
              <el-form-item :label="$t('app.setting.item.chat.maxTokens')">
                <el-tooltip
                  :content="$t('app.setting.item.chat.explain.maxTokens')"
                  placement="right"
                >
                  <el-input-number
                    v-model="appSettingStore.openAI.chatOption.maxTokens"
                    :min="1024"
                    :max="1024000"
                    :step="1"
                  />
                </el-tooltip>
              </el-form-item>

              <!-- Presence Penalty -->
              <el-form-item :label="$t('app.setting.item.chat.presencePenalty')">
                <el-tooltip
                  :content="$t('app.setting.item.chat.explain.presencePenalty')"
                  placement="right"
                >
                  <el-input-number
                    v-model="appSettingStore.openAI.chatOption.presencePenalty"
                    :min="-2"
                    :max="2"
                    :step="0.1"
                  />
                </el-tooltip>
              </el-form-item>

              <!-- Frequency Penalty -->
              <el-form-item :label="$t('app.setting.item.chat.frequencyPenalty')">
                <el-tooltip
                  :content="$t('app.setting.item.chat.explain.frequencyPenalty')"
                  placement="right"
                >
                  <el-input-number
                    v-model="appSettingStore.openAI.chatOption.frequencyPenalty"
                    :min="-2"
                    :max="2"
                    :step="0.1"
                  />
                </el-tooltip>
              </el-form-item>

              <!-- Context Size -->
              <el-form-item :label="$t('app.setting.item.chat.contextSize')">
                <el-tooltip
                  :content="$t('app.setting.item.chat.explain.contextSize')"
                  placement="right"
                >
                  <el-input-number
                    v-model="appSettingStore.openAI.chatOption.contextSize"
                    :min="0"
                    :max="100"
                    :step="1"
                  />
                </el-tooltip>
              </el-form-item>

              <!-- Auto Generate Title -->
              <el-form-item :label="$t('app.setting.item.chat.autoGenerateSessionName')">
                <el-tooltip
                  :content="$t('app.setting.item.chat.explain.autoGenerateSessionName')"
                  placement="right"
                >
                  <el-switch v-model="appSettingStore.openAI.chatOption.autoGenerateSessionName" />
                </el-tooltip>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 发音 -->
          <el-tab-pane :label="$t('app.setting.speech')">
            <el-form label-width="auto">
              <!-- Model -->
              <el-form-item :label="$t('app.setting.item.speech.model')">
                <el-select
                  v-model="appSettingStore.openAI.speechOption.model"
                  allow-create
                  filterable
                >
                  <el-option-group
                    v-for="group in OpenAISpeechModels"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-option-group>
                </el-select>
              </el-form-item>

              <!-- voice -->
              <el-form-item :label="$t('app.setting.item.speech.voice')">
                <el-select
                  v-model="appSettingStore.openAI.speechOption.voice"
                  allow-create
                  filterable
                >
                  <el-option
                    v-for="item in OpenAISpeechVoices"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <!-- speed -->
              <el-form-item :label="$t('app.setting.item.speech.speed')">
                <el-input-number
                  v-model="appSettingStore.openAI.speechOption.speed"
                  :min="0.25"
                  :max="4.0"
                  :step="0.01"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 网络 -->
          <el-tab-pane :label="$t('app.setting.network')">
            <el-form label-width="auto">
              <!-- 网络代理 -->
              <el-form-item :label="$t('app.setting.item.proxy.label')">
                <el-input
                  v-model="appSettingStore.app.proxy"
                  @change="setProxy(appSettingStore.app.proxy)"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 关于 -->
          <el-tab-pane>
            <template #label>
              <el-badge is-dot :hidden="!badge.appVersion">
                {{ $t('app.setting.about') }}
              </el-badge>
            </template>
            <el-form label-width="auto">
              <!-- 应用版本 -->
              <el-form-item :label="$t('app.setting.item.about.appVersion')">
                <el-space :size="15">
                  <div>v{{ appVersion }}</div>
                  <el-badge is-dot :hidden="!badge.appVersion">
                    <el-button
                      :icon="Download"
                      @click="openInBrowser('https://github.com/classfang/chatgpt-plus/releases')"
                    >
                      {{ $t('app.setting.item.about.appDownload') }}
                    </el-button>
                  </el-badge>
                </el-space>
              </el-form-item>

              <!-- 构建时间 -->
              <el-form-item :label="$t('app.setting.item.about.buildTime')">
                <div>{{ dayjs(buildInfo.buildTime).format('YYYY-MM-DD HH:mm:ss.SSS') }}</div>
              </el-form-item>

              <!-- 日志目录 -->
              <el-form-item :label="$t('app.setting.item.about.log')">
                <el-button :icon="Folder" @click="openLogDir()">
                  {{ $t('app.setting.item.about.openLogDir') }}
                </el-button>
              </el-form-item>

              <!-- 缓存目录 -->
              <el-form-item :label="$t('app.setting.item.about.cache')">
                <el-button :icon="Folder" @click="openCacheDir()">
                  {{ $t('app.setting.item.about.openCacheDir') }}
                </el-button>
              </el-form-item>

              <!-- 开发者工具 -->
              <el-form-item :label="$t('app.setting.item.about.devTools')">
                <el-button :icon="Tools" @click="openDevTools()">
                  {{ $t('app.setting.item.about.openDevTools') }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.app-setting {
  height: $app-icon-size-base;
  width: $app-icon-size-base;

  .setting-icon {
    height: 100%;
    width: 100%;
    color: var(--el-text-color-secondary);
    transition: color $app-transition-base;
    cursor: pointer;

    &:hover {
      color: var(--el-text-color-primary);
    }
  }

  .dialog-body {
    height: $app-dialog-height;

    :deep(.el-tabs) {
      height: 100%;

      .el-tabs--right,
      .el-tabs__content,
      .el-tabs--left,
      .el-tabs__content,
      .el-tab-pane {
        height: 100%;
      }
    }

    :deep(.el-tabs__content) {
      box-sizing: border-box;
      padding: $app-padding-extra-small $app-padding-small;
    }

    .setting-item-icon {
      height: $app-icon-size-small;
      width: $app-icon-size-small;
    }
  }
}
</style>
