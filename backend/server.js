const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { testConnection, initDatabase } = require('./config/database')
const { connectRedis } = require('./config/redis')

const app = express()
const PORT = process.env.PORT || 8081

// 中间件
app.use(cors())
app.use(express.json())

// 初始化数据库和Redis连接
async function initializeServices() {
  try {
    // 连接 MySQL
    const dbConnected = await testConnection()
    if (dbConnected) {
      await initDatabase()
    }
    
    // 连接 Redis
    await connectRedis()
    console.log('所有服务初始化完成')
  } catch (error) {
    console.error('服务初始化失败:', error.message)
  }
}

initializeServices()

process.on('SIGINT', async (info) => {
  console.log('收到 SIGINT 信号，开始优雅关闭...')
  console.log('info>>',info)
  try {
    const { disconnectRedis } = require('./config/redis')
    await disconnectRedis()
    console.log('服务已优雅关闭')
    process.exit(0)
  } catch (error) {
    console.error('关闭过程中出错:', error.message)
    process.exit(1)
  }
})

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

// 这个路由已经被 /api/users 路由模块替代，这里删除重复的

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
