<template>
  <div class="login-container">
    <ChildComponent />
    <div class="img1">
      <img src="../medias/login.png" />
    </div>
    <div class="search-container">
      <input
        type="text"
        class="search-input"
        v-model="searchQuery"
        placeholder="请输入搜索内容"
      />
      <button class="search-button" @click="performSearch">搜索</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import ChildComponent from './Test.vue';
const searchQuery = ref(''); // 使用ref创建响应式数据

function performSearch() {
  if (searchQuery.value.trim() !== '') {
    console.log('搜索内容:', searchQuery.value);
    // 这里可以调用API进行搜索或执行其他搜索逻辑
    // 例如: this.$emit('search', searchQuery.value);
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background-color: rgb(196, 213, 209);
  position: relative;
}
.img1 {
  top: 10%;
  text-align: center;
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
.img1 img {
  margin: 0 auto;
}
.search-container {
  
  position: absolute;
  top:40%;
  left:30%;
  align-items: center;
}

.search-input {
    width: 500px;
  flex: 1;
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}
</style>
