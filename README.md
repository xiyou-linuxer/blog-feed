# 博客订阅源聚合 blog-feed

从远程源获取订阅列表 JSON，定时爬取解析其中的 Atom/RSS 订阅源，并以 API 的形式提供文章列表。

## 项目依赖

前端：

- [Nitro](https://nitro.build/)：[UnJS](https://unjs.io/) 家族的 Web 服务器，基于文件路由，支持定时任务
- [Mongoose](https://mongoosejs.com/)：MongoDB 的 ODM，用于操作数据库
- [Fast XML Parser](https://naturalintelligence.github.io/fast-xml-parser/#readme)：用于解析 Atom/RSS
- [env-cmd](https://github.com/toddbluhm/env-cmd#readme)：用于在生产环境加载 `.env` 变量

环境：

- [Node.js](https://nodejs.org/)：JavaScript 运行时
- [MongoDB](https://www.mongodb.com/)：数据库
- [PM2](https://pm2.keymetrics.io/)：进程管理器

## 项目结构

```sh
blog-feed
├── .env                    # 环境变量
├── eslint.config.mjs       # ESLint 配置
├── nitro.config.mjs        # Nitro 配置
├── models                  # 数据模型
│   └── article.ts              # 文章模型
├── route                   # 基于文件的路由
│   ├── index.get.ts            # 状态 API
│   ├── article.get.ts          # 文章 API
│   └── manual-update.post.ts   # 手动更新 API
├── tasks                   # 定时任务
│   └── update.ts               # 爬取文章并更新数据库
└── utils                   # 工具函数
    ├── crawl.ts                # Feed 爬取
    ├── db.ts                   # 数据库操作
    └── feed.ts                 # Feed 处理
```

## 项目配置

在项目根目录下创建 `.env` 文件，或配置环境变量：

```ini
# MongoDB 连接字符串
MONGO_URI="mongodb://user:password@localhost:27017/blog-feed"
```

在 `nitro.config.ts` 中配置订阅源集合：

```ts
export default defineNitroConfig({
    // ...
    runtimeConfig: {
        // 订阅源集合 URL，其他非必要字段见配置
        feedListUrl: 'https://raw.githubusercontent.com/xiyou-linuxer/website-2024/refs/heads/main/docs/.vitepress/data/members.json',
        tagKey: 'grade', // 订阅源标签字段，用于查询时分类
        feedKey: 'feed', // 订阅源地址字段
    },
})
```

## 项目运行

### 开发

在项目根目录下运行以下命令：

```sh
pnpm i
pnpm dev
```

访问 http://localhost:3000/_nitro/tasks/update 即可手动触发更新任务。

### 配置 PM2

PM2 是一个进程管理器，用于在生产环境中管理 Node.js 应用程序。

```bash
pnpm i pm2 -g
```

### 生产

在项目根目录下运行以下命令：

```sh
pnpm i          # 安装依赖
pnpm build      # 构建项目
pnpm preview    # 前台运行
pnpm start      # 后台运行
pnpm stop       # 停止后台运行
pnpm restart    # 重启后台运行
```

当项目有更新时，直接运行 `pnpm hot` 即可，无需重新启动项目。

### 文章更新

在 `nitro.config.ts` 的 `scheduledTasks` 中，使用 cron 表达式配置了 `update` 定时任务，用于文章更新。

项目启动时也会更新文章，要禁用此行为，请设置环境变量或 `.env` 的 `DISABLE_STARTUP_UPDATE` 为 `true`。

## 项目 API

#### `GET /`

获取服务器统计信息

##### 查询参数（可选）

| 参数  | 说明     | 示例         |
| ----- | -------- | ------------ |
| `tag` | 筛选标签 | `/?tag=2022` |

##### 返回格式

```jsonc
{
  "update": {
    // 服务器启动时间
    "init": "2025-03-07T14:33:33.869Z",
    // 更新开始时间
    "start": "2025-03-07T14:33:36.478Z",
    // 更新完成时间
    "finish": null
  },
  // （标签下的）订阅源个数
  "length": 151
}
```

#### `GET /articles`

获取文章列表，支持按订阅源、标签筛选，支持分页。

##### 查询参数（可选）

| 参数    | 说明       | 示例                 |
| ------- | ---------- | -------------------- |
| `page`  | 页码       | `/articles?page=1`   |
| `limit` | 每页文章数 | `/articles?limit=10` |

如果指定了未知参数，则查询结果为空，因为所有剩余参数会查询数据库，例如：

| 参数   | 说明         | 示例                                              |
| ------ | ------------ | ------------------------------------------------- |
| `feed` | 按订阅源筛选 | `/articles?feed=https://blog.zhilu.cyou/atom.xml` |
| `tag`  | 按标签筛选   | `/articles?tag=1`                                 |

##### 返回格式

```jsonc
{
  "result": "success",
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 151,
    "totalPages": 7
  },
  "articles": [
    {
      "_id": "67c6694d53318941f8373de2",
      "link": "https://blog.zhilu.cyou/2024/vitepress-enhancement",
      "__v": 0,
      "author": "纸鹿摸鱼处",
      "createdAt": "2025-03-04T02:45:26.719Z",
      "date": "2024-11-03T09:54:50.000Z",
      "description": "VitePress 的基本使用与定制技巧，涵盖项目初始化、汉化配置、图标引入、自定义主题等内容，旨在利用 VitePress 构建美观、高效的静态站点。",
      "feed": "https://blog.zhilu.cyou/atom.xml",
      "tag": "2022",
      "title": "VitePress 不完全优化指南"
    }
    // ...
  ]
}
```

#### `GET /opml`

获取订阅源列表，返回格式为 OPML。

#### `GET /rss`

获取订阅源的文章列表，返回格式为 RSS。
