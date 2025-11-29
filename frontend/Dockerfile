# 阶段1: 构建阶段
FROM node:18-alpine AS build

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装全部依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 阶段2: 生产阶段
FROM nginx:alpine

# 🔴 关键步骤：先删除 Nginx 默认的主配置文件（避免覆盖失败）
RUN rm -f /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建结果到 nginx（路径正确，和你的 Nginx 配置 root 对应）
COPY --from=build /app/dist /usr/share/nginx/html

# 复制你的自定义 Nginx 主配置（现在能确保覆盖成功）
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
