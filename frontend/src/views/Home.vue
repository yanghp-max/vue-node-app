<template>
  <div class="home">
    <h1>欢迎使用 Vue + Node.js 全栈应用</h1>
    <div class="api-test">
      <h2>API 测试</h2>
      <button @click="fetchData">获取后端数据</button>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="data" class="data">
        <h3>后端返回的数据:</h3>
        <pre>{{ JSON.stringify(data, null, 2) }}</pre>
      </div>
      <div v-if="error" class="error">
        错误: {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      data: null,
      loading: false,
      error: null
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/hello')
        this.data = response.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.api-test {
  margin-top: 30px;
  text-align: left;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #369970;
}

.loading, .error {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}

.loading {
  background-color: #f0f9ff;
  color: #0369a1;
}

.error {
  background-color: #fef2f2;
  color: #dc2626;
}

.data {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 4px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>