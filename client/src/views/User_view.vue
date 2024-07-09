<template>
  <div class="login-container" >
      <child-component></child-component>
        <div class="img1">
            <img src="../medias/login.png" >
      </div>
      <div>
    <h2>Search Books</h2>
    <form @submit.prevent="searchBooks">
      <input v-model="keyword" placeholder="Keyword" />
      <!-- <select v-model="borrowable">
        <option value="">All</option>
        <option value="1">Borrowable</option>
        <option value="0">Not Borrowable</option>
      </select> -->
      <button type="submit">Search</button>
    </form>
    <!-- <ul>
      <li v-for="book in books" :key="book.bookid">{{ book.title }} by {{ book.author }}</li>
    </ul> -->
    <p v-if="message">{{ message }}</p>
  </div>
  <el-table
      :data="tableData"
      style="width: 60% ;margin-top:20px">
      <el-table-column
        prop="title"
        label="书名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="180">
      </el-table-column>
      <el-table-column
        prop="category"
        label="分类">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格">
      </el-table-column>
    </el-table>
  </div>
  
</template>

<script>
import axios from 'axios';
import PubSub from 'pubsub-js';
import ChildComponent from './Test.vue';
export default {
    name: 'SearchBooks',
  data() {
    return {
      token: '',
      keyword: '',
      borrowable: '',
      books: [],
      message: '',
      tableData: []
    };
  },
  components:{
    ChildComponent
  },

  methods: {
    async searchBooks() {
      try {
        const response = await axios.get('/book/_token/search',  {
          params: {
            keyword: this.keyword,
            borrowable: this.borrowable
          },  
          headers: {
            token:this.token,
          }

        });
        console.log('Response:', response.data.data.rows[0]);
        if (response.data && response.data.data && response.data.data.rows) {
          // 确保赋值前转换为数组
          
           // 将单个对象放入数组中，并赋值给tableData
        this.tableData = [response.data.data.rows[0]];
          this.message = '可以查询';
        } else {
          this.message = '不可以查询';
        }
      } catch (error) {
        console.error('Error searching books:', error);
        this.message = 'Error searching books';
      }
    }
  },
  mounted() {
    PubSub.subscribe('userEvent', (name, data) => {
      this.token = data
      console.log(this.token)
    })
  }
};
</script>
<style lang="scss" scoped>
.login-container{
      
      display: flex;       /* 使用Flexbox布局 */
    flex-direction: column; /* 子元素垂直排列 */
    
    align-items: center; /* 水平居中 */
    height: 100vh;
    background-color: rgb(196, 213, 209);
    text-align: center;
    }
  
    .img1 img{
        margin: 0 auto;
        
    }
h2{
  margin-top: -20px;
  color:white;
  font-size: 25px;
}
input {
  position:relative;
  padding: 8px;
  margin-top: 20px;
  width: 500px;
  box-sizing: border-box;
}

button {
  margin-left: 20px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 15px;
}

button:hover {
  background-color: #0056b3;
}

</style>