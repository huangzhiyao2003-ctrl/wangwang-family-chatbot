# 旺旺家庭聊天小助手

一个 Vite + React + Cloudflare Pages Functions 的聊天页面，用来给家人解释旺旺近况。

快捷问题使用前端本地固定回复；输入框自由输入会请求 Cloudflare Pages Function `/api/chat`，由后端调用 DeepSeek。API Key 不会写进前端代码。

## 本地运行

先安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

然后按终端提示打开本地地址。

## 构建

```bash
npm run build
```

构建产物会生成在：

```bash
dist
```

## 静态部署

部署时使用 `dist` 目录作为静态站点目录即可。

## Cloudflare 环境变量

在 Cloudflare Pages 项目里设置环境变量：

```bash
DEEPSEEK_API_KEY
```

不要把真实 API Key 写进 `src` 或 README。
