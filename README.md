<p align="center">
  <img src="/resources/icon.png" alt="logo" width="120">
</p>
<h2 align="center">ChatGPT Plus</h2>
<h4 align="center">ChatGPT client(linux, mac, win)</h4>

<h4 align="center">
  <a href="/README_zhCN.md">中文简介</a> | <a href="/README.md">English README</a>
</h4>

## 1. Why ChatGPT Plus

You can use ChatGPT Plus on pay-as-you-go basis with just openai key.

<img src="/demo/1.png" alt="demo">

<img src="/demo/2.png" alt="demo">

## 2. Roadmap and contributing

We're looking to add more features to ChatGPT Plus. The highest priorities are:

- [x] Text Chat
- [x] Regenerate
- [x] Speech
- [x] Image Input
- [x] File Input
- [x] Clean Cache
- [x] System Prompt
- [x] Prompt Library
- [x] Internet Search
- [x] Image Generation
- [x] Data Backup
- [x] Memory
- [x] Summarize Web Content
- [x] Clear Context
- [x] Archived
- [x] Desktop Screenshot
- [x] Token Statistics

If you're a developer who'd like to help with any of these, please open an issue to discuss the best way to tackle the challenge.

## 3. Latest installation package

You can find the installation packages for each platform from [releases](https://github.com/classfang/chatgpt-plus/releases).

If you encounter any installation and use problems, you are welcome to open an issue.

### 3.1. The App under macOS indicates that it is damaged and cannot open the solution

Open the terminal, enter the following command, and execute:

```shell
sudo xattr -d com.apple.quarantine /Applications/xxxx.app
```

Note: Replace /Applications/xxxx.app with your App path.

## 4. Develop

### 4.1 Clone this store

```shell
git clone https://github.com/classfang/chatgpt-plus.git
```

### 4.2 Install dependencies

```shell
yarn install
```

### 4.3 Develop run

```shell
yarn dev
```

### 4.4 Package

```shell
yarn build:mac
```

