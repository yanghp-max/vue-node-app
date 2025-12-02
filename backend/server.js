const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { testConnection, initDatabase } = require('./config/database')
// const { connectRedis } = require('./config/redis')

const app = express()
const PORT = process.env.PORT || 8081

// 中间件
app.use(cors())
app.use(express.json())

// 初始化数据库和Redis连接
async function initializeServices() {
  // 连接 MySQL
  const dbConnected = await testConnection()
  if (dbConnected) {
    await initDatabase()
  }
  
  // 连接 Redis
  // await connectRedis()
}

initializeServices()

// 导入路由
const userRoutes = require('./routes/users')

// 路由
app.get('/', (req, res) => {
  res.json({
    message: 'Node.js API 服务器运行中',
    version: '1.0.0',
    features: ['MySQL', 'Redis'],
    timestamp: new Date().toISOString()
  })
})

// 用户路由
app.use('/api/users', userRoutes)

app.get('/api/hello', (req, res) => {
  res.json({
    message: '你好！这是来自后端 API 的响应',
    data: {
      server: 'Node.js + Express',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      random: Math.floor(Math.random() * 1000)
    }
  })
})

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' }
  ]
  res.json({
    message: '用户列表获取成功',
    users: users
  })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : '请联系管理员'
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    message: '接口不存在',
    path: req.path
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`)
})
