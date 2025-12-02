const redis = require('redis');
require('dotenv').config();

const redisConfig = {
  host: process.env.REDIS_HOST || 'test_redis',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '949941400',
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
};

const client = redis.createClient(redisConfig);

client.on('connect', () => {
  console.log('Redis 连接成功');
});

client.on('error', (err) => {
  console.error('Redis 连接错误:', err.message);
});

client.on('ready', () => {
  console.log('Redis 准备就绪');
});

async function connectRedis() {
  try {
    await client.connect();
    return true;
  } catch (error) {
    console.error('Redis 连接失败:', error.message);
    return false;
  }
}

async function disconnectRedis() {
  try {
    await client.quit();
    console.log('Redis 连接已关闭');
  } catch (error) {
    console.error('Redis 关闭连接失败:', error.message);
  }
}

module.exports = {
  client,
  connectRedis,
  disconnectRedis
};
