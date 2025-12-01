<template>
  <div class="users-container">
    <h1>用户管理系统</h1>
    
    <div class="stats-container">
      <div class="stat-card">
        <h3>Redis 统计</h3>
        <p>数据库大小: {{ redisStats.dbSize || 0 }} keys</p>
        <button @click="loadRedisStats" class="btn btn-secondary">刷新统计</button>
      </div>
    </div>

    <!-- 添加用户表单 -->
    <div class="form-container">
      <h2>添加新用户</h2>
      <form @submit.prevent="addUser" class="user-form">
        <div class="form-group">
          <label>姓名:</label>
          <input v-model="newUser.name" type="text" required>
        </div>
        <div class="form-group">
          <label>邮箱:</label>
          <input v-model="newUser.email" type="email" required>
        </div>
        <div class="form-group">
          <label>年龄:</label>
          <input v-model="newUser.age" type="number" min="0">
        </div>
        <button type="submit" class="btn btn-primary">添加用户</button>
      </form>
    </div>

    <!-- 用户列表 -->
    <div class="users-list">
      <h2>用户列表</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="user-grid">
          <div v-for="user in users" :key="user.id" class="user-card">
            <div v-if="editingUser && editingUser.id === user.id" class="edit-form">
              <input v-model="editingUser.name" placeholder="姓名">
              <input v-model="editingUser.email" type="email" placeholder="邮箱">
              <input v-model="editingUser.age" type="number" placeholder="年龄">
              <div class="edit-buttons">
                <button @click="updateUser" class="btn btn-success">保存</button>
                <button @click="cancelEdit" class="btn btn-secondary">取消</button>
              </div>
            </div>
            <div v-else class="user-info">
              <h3>{{ user.name }}</h3>
              <p>邮箱: {{ user.email }}</p>
              <p>年龄: {{ user.age }}</p>
              <p>创建时间: {{ formatDate(user.created_at) }}</p>
              <div class="user-actions">
                <button @click="startEdit(user)" class="btn btn-warning">编辑</button>
                <button @click="deleteUser(user.id)" class="btn btn-danger">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_BASE = 'http://localhost:8081/api'

export default {
  name: 'Users',
  data() {
    return {
      users: [],
      newUser: {
        name: '',
        email: '',
        age: ''
      },
      editingUser: null,
      loading: false,
      error: null,
      redisStats: {}
    }
  },
  methods: {
    async loadUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_BASE}/users`)
        this.users = response.data.users
      } catch (error) {
        this.error = '加载用户列表失败: ' + error.message
        console.error('加载用户失败:', error)
      } finally {
        this.loading = false
      }
    },

    async loadRedisStats() {
      try {
        const response = await axios.get(`${API_BASE}/users/redis/stats`)
        this.redisStats = response.data
      } catch (error) {
        console.error('加载 Redis 统计失败:', error)
      }
    },

    async addUser() {
      try {
        await axios.post(`${API_BASE}/users`, this.newUser)
        this.newUser = { name: '', email: '', age: '' }
        await this.loadUsers()
      } catch (error) {
        this.error = '添加用户失败: ' + error.response?.data?.message || error.message
        console.error('添加用户失败:', error)
      }
    },

    startEdit(user) {
      this.editingUser = { ...user }
    },

    cancelEdit() {
      this.editingUser = null
    },

    async updateUser() {
      try {
        const { id, name, email, age } = this.editingUser
        await axios.put(`${API_BASE}/users/${id}`, { name, email, age })
        this.editingUser = null
        await this.loadUsers()
      } catch (error) {
        this.error = '更新用户失败: ' + error.response?.data?.message || error.message
        console.error('更新用户失败:', error)
      }
    },

    async deleteUser(userId) {
      if (confirm('确定要删除这个用户吗？')) {
        try {
          await axios.delete(`${API_BASE}/users/${userId}`)
          await this.loadUsers()
        } catch (error) {
          this.error = '删除用户失败: ' + error.response?.data?.message || error.message
          console.error('删除用户失败:', error)
        }
      }
    },

    formatDate(dateString) {
      if (!dateString) return '未知'
      return new Date(dateString).toLocaleString('zh-CN')
    }
  },

  async mounted() {
    await this.loadUsers()
    await this.loadRedisStats()
    
    // 每10秒刷新一次 Redis 统计
    setInterval(this.loadRedisStats, 10000)
  }
}
</script>

<style scoped>
.users-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.stats-container {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-container, .users-list {
  background: white;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #1e7e34;
}

.btn-warning {
  background-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

.error {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-info h3 {
  margin-top: 0;
  color: #007bff;
}

.user-info p {
  margin: 5px 0;
  color: #495057;
}

.user-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-form input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.edit-buttons {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .users-container {
    padding: 10px;
  }
  
  .user-form {
    grid-template-columns: 1fr;
  }
  
  .user-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-container {
    flex-direction: column;
  }
}
</style>