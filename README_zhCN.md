<p align="center">
  <img src="/resources/icon.png" alt="logo" width="120">
</p>
<h2 align="center">ChatGPT Plus</h2>
<h4 align="center">ChatGPT 客户端(linux, mac, win)</h4>

<h4 align="center">
  <a href="/README.md">English README</a> | <a href="/README_zhCN.md">中文简介</a>
</h4>

## 1. 为什么选择 ChatGPT Plus

只需一个 API Key，即可体验按需付费的 ChatGPT Plus。

<img src="/demo/zhCN/1.png" alt="demo">

<img src="/demo/zhCN/2.png" alt="demo">

## 2. 开发路线和贡献

我们希望为 ChatGPT Plus 添加更多功能。目前最重要的是：

- [x] 文本对话
- [x] 重新生成
- [x] 发音
- [x] 图片输入
- [x] 文件输入
- [x] 清理缓存
- [x] 系统指令
- [x] 指令库
- [x] 互联网搜索
- [x] 图片生成
- [x] 数据备份
- [x] 记忆
- [x] 总结网页内容
- [x] 断开上下文
- [x] 归档
- [x] 获取屏幕截图
- [x] Token 统计

如果你是一名开发者，想要帮助解决其中的任何一个问题，请打开一个 issue 来讨论解决。

## 3. 最新安装包

你可以在 [releases](https://github.com/classfang/chatgpt-plus/releases) 中找到个平台的安装包。

如果遇到任何安装和使用问题，欢迎提交 issue。

### 3.1. App 在 macOS 下提示已损坏无法打开解决办法

打开终端，输入以下命令，并执行：

```shell
sudo xattr -d com.apple.quarantine /Applications/xxxx.app
```

注意：/Applications/xxxx.app 换成你的App路径。

## 4. 开发

### 4.1 克隆仓库

```shell
git clone https://github.com/classfang/chatgpt-plus.git
```

### 4.2 安装依赖

```shell
yarn install
```

### 4.3 运行

```shell
yarn dev
```

### 4.4 构建

```shell
yarn build:mac
```

