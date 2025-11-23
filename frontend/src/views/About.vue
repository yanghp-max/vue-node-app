<template>
  <div class="about">
    <h1>关于我们</h1>
    <p>这是一个使用 Vue 3 + Node.js + Express 构建的全栈应用示例。</p>
    <p>支持 Docker 容器化部署。</p>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

p {
  line-height: 1.6;
  margin-bottom: 15px;
}
</style>