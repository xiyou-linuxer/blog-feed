# 构建阶段
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9 --activate

WORKDIR /app

# 先复制依赖清单，利用 Docker 缓存层
COPY package.json .npmrc ./
RUN pnpm install

# 复制全部源码并构建
COPY . .
RUN pnpm build

# 运行阶段
FROM node:22-alpine

WORKDIR /app

# 只复制构建产物和运行时依赖
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
