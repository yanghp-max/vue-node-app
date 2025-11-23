# Vue + Node.js 全栈应用

这是一个使用 Vue 3 作为前端，Node.js + Express 作为后端的全栈应用，支持 Docker 容器化部署。

## 项目结构

```
project/
├── frontend/          # Vue 前端应用
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── App.vue
│   │   └── main.js
│   ├── Dockerfile         # 生产环境 Dockerfile
│   ├── Dockerfile.dev     # 开发环境 Dockerfile
│   ├── nginx.conf         # Nginx 配置
│   └── package.json
├── backend/           # Node.js 后端 API
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml        # 生产环境
├── docker-compose.dev.yml    # 开发环境
└── README.md
```

## 本地开发

### 前置要求

- Node.js 18+
- npm 或 yarn
- Docker 和 Docker Compose（可选）

### 本地运行（不使用 Docker）

1. 启动后端服务：
```bash
cd backend
npm install
npm run dev
```

2. 启动前端服务（新终端）：
```bash
cd frontend
npm install
npm run dev
```

3. 访问应用：
- 前端：http://localhost:3000
- 后端 API：http://localhost:5000

### Docker 开发环境

1. 启动开发环境：
```bash
docker-compose -f docker-compose.dev.yml up --build
```

2. 访问应用：
- 前端：http://localhost:3000
- 后端 API：http://localhost:5000

3. 停止服务：
```bash
docker-compose -f docker-compose.dev.yml down
```

## 生产部署

### 使用 Docker Compose

1. 构建并启动生产环境：
```bash
docker-compose up --build -d
```

2. 访问应用：
- 前端：http://localhost:80
- 后端 API：http://localhost:5000

3. 停止服务：
```bash
docker-compose down
```

### 单独构建镜像

1. 构建后端镜像：
```bash
cd backend
docker build -t vue-node-backend .
```

2. 构建前端镜像：
```bash
cd frontend
docker build -t vue-node-frontend .
```

## API 接口

- `GET /` - 服务器状态
- `GET /api/hello` - 测试接口
- `GET /api/users` - 用户列表

## 功能特性

- Vue 3 + Vue Router 前端路由
- Node.js + Express 后端 API
- CORS 跨域支持
- 生产环境 Nginx 配置
- 多阶段 Docker 构建
- 开发环境热重载
- 容器化部署支持
- 健康检查配置

## 开发说明

- 前端开发服务器运行在 3000 端口
- 后端 API 服务器运行在 5000 端口
- 生产环境中前端通过 Nginx 在 80 端口提供服务
- 生产环境前端通过 Nginx 代理 API 请求到后端

## Windows 系统注意事项

- 如果遇到端口占用问题，请检查端口是否被其他程序占用
- Docker Desktop for Windows 需要正确安装和配置
- 开发环境中的文件挂载在 Windows 下可能会有性能问题，建议使用 WSL2