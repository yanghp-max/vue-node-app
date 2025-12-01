# MySQL 和 Redis 操作实现

## 项目结构

```
d:/code/test/20251123120153/
├── backend/
│   ├── config/
│   │   ├── database.js    # MySQL 数据库配置
│   │   └── redis.js       # Redis 缓存配置
│   ├── routes/
│   │   └── users.js       # 用户 CRUD API 路由
│   ├── .env               # 环境变量配置
│   ├── server.js          # 主服务器文件
│   └── package.json       # 后端依赖
├── frontend/
│   └── src/
│       ├── views/
│       │   └── Users.vue  # 用户管理界面
│       └── router/
│           └── index.js   # 路由配置
├── docker-compose.yml     # Docker 容器编排
└── init.sql              # 数据库初始化脚本
```

## 功能特性

### 后端功能
1. **MySQL 数据库操作**
   - 用户表创建和管理
   - CRUD 操作（创建、读取、更新、删除）
   - 连接池管理
   - 数据库初始化

2. **Redis 缓存功能**
   - 用户列表缓存（60秒）
   - 单个用户信息缓存（300秒）
   - 缓存自动失效和更新
   - Redis 统计信息 API

3. **API 接口**
   - `GET /api/users` - 获取所有用户（支持缓存）
   - `GET /api/users/:id` - 获取单个用户（支持缓存）
   - `POST /api/users` - 创建新用户
   - `PUT /api/users/:id` - 更新用户信息
   - `DELETE /api/users/:id` - 删除用户
   - `GET /api/users/redis/stats` - Redis 统计信息

### 前端功能
1. **用户管理界面**
   - 用户列表展示
   - 添加新用户
   - 编辑用户信息
   - 删除用户
   - Redis 统计信息显示

2. **响应式设计**
   - 适配桌面和移动设备
   - 现代化 UI 设计
   - 实时数据更新

## 快速启动

### 使用 Docker Compose（推荐）

1. 启动所有服务：
```bash
docker-compose up -d
```

2. 服务访问地址：
   - 前端应用: http://localhost
   - 后端 API: http://localhost:5000
   - MySQL: localhost:3306
   - Redis: localhost:6379

### 本地开发

#### 后端启动
1. 安装依赖：
```bash
cd backend
npm install
```

2. 启动 MySQL 和 Redis（确保服务运行）

3. 启动后端服务：
```bash
npm run dev
```

#### 前端启动
1. 安装依赖：
```bash
cd frontend
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

## 配置说明

### 数据库配置 (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=appuser
DB_PASSWORD=apppass
DB_NAME=testapp
```

### Redis 配置 (.env)
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## 技术栈

### 后端
- **Node.js** + **Express.js** - Web 框架
- **mysql2** - MySQL 数据库驱动
- **redis** - Redis 客户端
- **dotenv** - 环境变量管理
- **cors** - 跨域资源共享

### 前端
- **Vue.js 3** - 前端框架
- **Vue Router** - 路由管理
- **Axios** - HTTP 客户端
- **Vite** - 构建工具

### 基础设施
- **MySQL 8.0** - 关系型数据库
- **Redis 7** - 内存数据库（缓存）
- **Docker** + **Docker Compose** - 容器化部署

## 缓存策略

1. **用户列表缓存**
   - 缓存键: `users:all`
   - 过期时间: 60 秒
   - 更新策略: 用户数据变更时自动清除

2. **单个用户缓存**
   - 缓存键: `user:{id}`
   - 过期时间: 300 秒
   - 更新策略: 用户信息变更时自动清除

## 示例 API 调用

### 获取所有用户
```bash
curl http://localhost:5000/api/users
```

### 创建用户
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "测试用户", "email": "test@example.com", "age": 25}'
```

### 更新用户
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "更新后的姓名"}'
```

### 删除用户
```bash
curl -X DELETE http://localhost:5000/api/users/1
```

## 注意事项

1. 确保 MySQL 和 Redis 服务正常运行
2. 数据库连接池配置合理
3. Redis 连接错误处理完善
4. 缓存失效策略合理
5. 前后端跨域配置正确

## 扩展建议

1. 添加用户认证和授权
2. 实现分页查询
3. 添加搜索和过滤功能
4. 实现批量操作
5. 添加操作日志记录
6. 实现数据备份和恢复