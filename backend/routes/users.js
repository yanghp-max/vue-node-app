const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { client } = require('../config/redis');

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    // 先尝试从 Redis 缓存获取
    const cacheKey = 'users:all';
    const cachedUsers = await client.get(cacheKey);
    
    if (cachedUsers) {
      console.log('从 Redis 缓存获取用户列表');
      return res.json({
        message: '用户列表获取成功（缓存）',
        users: JSON.parse(cachedUsers)
      });
    }
    
    // 从数据库获取
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY created_at DESC');
    
    // 存入 Redis 缓存，设置过期时间为 60 秒
    await client.setEx(cacheKey, 60, JSON.stringify(rows));
    console.log('从 MySQL 获取用户列表并缓存');
    
    res.json({
      message: '用户列表获取成功',
      users: rows
    });
  } catch (error) {
    console.error('获取用户列表失败:', error.message);
    res.status(500).json({
      message: '获取用户列表失败',
      error: error.message
    });
  }
});

// 获取单个用户
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const cacheKey = `user:${userId}`;
    
    // 先尝试从 Redis 缓存获取
    const cachedUser = await client.get(cacheKey);
    
    if (cachedUser) {
      console.log(`从 Redis 缓存获取用户 ${userId}`);
      return res.json({
        message: '用户信息获取成功（缓存）',
        user: JSON.parse(cachedUser)
      });
    }
    
    // 从数据库获取
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }
    
    // 存入 Redis 缓存，设置过期时间为 300 秒
    await client.setEx(cacheKey, 300, JSON.stringify(rows[0]));
    console.log(`从 MySQL 获取用户 ${userId} 并缓存`);
    
    res.json({
      message: '用户信息获取成功',
      user: rows[0]
    });
  } catch (error) {
    console.error('获取用户信息失败:', error.message);
    res.status(500).json({
      message: '获取用户信息失败',
      error: error.message
    });
  }
});

// 创建用户
router.post('/', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        message: '姓名和邮箱为必填项'
      });
    }
    
    // 检查邮箱是否已存在
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: '邮箱已被使用'
      });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || 0]
    );
    
    // 清除相关缓存
    await client.del('users:all');
    
    console.log(`创建用户成功，ID: ${result.insertId}`);
    
    res.status(201).json({
      message: '用户创建成功',
      user: {
        id: result.insertId,
        name,
        email,
        age: age || 0
      }
    });
  } catch (error) {
    console.error('创建用户失败:', error.message);
    res.status(500).json({
      message: '创建用户失败',
      error: error.message
    });
  }
});

// 更新用户
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, age } = req.body;
    
    // 检查用户是否存在
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }
    
    // 如果更新邮箱，检查是否已被其他用户使用
    if (email) {
      const [emailCheck] = await pool.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
      if (emailCheck.length > 0) {
        return res.status(400).json({
          message: '邮箱已被其他用户使用'
        });
      }
    }
    
    // 动态构建更新语句
    const updateFields = [];
    const updateValues = [];
    
    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (age !== undefined) {
      updateFields.push('age = ?');
      updateValues.push(age);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        message: '没有提供要更新的字段'
      });
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(userId);
    
    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // 清除相关缓存
    await client.del('users:all');
    await client.del(`user:${userId}`);
    
    console.log(`更新用户 ${userId} 成功`);
    
    res.json({
      message: '用户更新成功'
    });
  } catch (error) {
    console.error('更新用户失败:', error.message);
    res.status(500).json({
      message: '更新用户失败',
      error: error.message
    });
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 检查用户是否存在
    const [existingUsers] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({
        message: '用户不存在'
      });
    }
    
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    
    // 清除相关缓存
    await client.del('users:all');
    await client.del(`user:${userId}`);
    
    console.log(`删除用户 ${userId} 成功`);
    
    res.json({
      message: '用户删除成功'
    });
  } catch (error) {
    console.error('删除用户失败:', error.message);
    res.status(500).json({
      message: '删除用户失败',
      error: error.message
    });
  }
});

// Redis 统计信息
router.get('/redis/stats', async (req, res) => {
  try {
    const info = await client.info();
    const dbSize = await client.dbSize();
    
    res.json({
      message: 'Redis 统计信息',
      info: info.split('\r\n').slice(0, 10), // 只返回前10行信息
      dbSize: dbSize
    });
  } catch (error) {
    console.error('获取 Redis 统计信息失败:', error.message);
    res.status(500).json({
      message: '获取 Redis 统计信息失败',
      error: error.message
    });
  }
});

module.exports = router;