<template>
    <div class="login-container">
      <ChildComponent />
      <div class="img1">
        <img src="../medias/login.png" />
      </div>
      <div class="search-container">
        
        <button class="search-button" @click="performSearch">创建</button>
      </div>
      <n-space vertical :size="12">
        <n-data-table
        :bordered="false"
        :single-line="false"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        class="custom-table"
      />
      
    </n-space>
    </div>
  </template>
  <script>
  import { ref } from 'vue';
  import ChildComponent from './Test.vue';
  
  import axios from 'axios'; // 确保安装了 axios

  import { h, defineComponent } from "vue";
  import { NTag, NButton, useMessage, NSpace, NDataTable } from 'naive-ui';

  const createColumns = ({
    sendMail
  }) => {
    return [
      {
        title: "用户名",
        key: "name"
      },
      {
        title: "密码",
        key: "age"
      },


    ];
  };


  export default defineComponent({
    components: {
    ChildComponent,
    NSpace,
    NDataTable,
    NTag,
    NButton
  },
    setup() {
      const message = useMessage();
      const data=ref([]);
      const fetchData = async () => {
      try {
        const response = await axios.get("/user/_token/admin/list"); // 发送 GET 请求到API
        if (response.data.code === 200) {
          // data.value = response.data.rows; // 将响应数据赋值给 data
          console.log(response.data.rows);
        } else {
          message.error("查询失败: " + response.data.msg);
        }
      } catch (error) {
        message.error("网络请求失败: " + error.message);
      }
    };
      fetchData();
      return {
        data,
        columns: createColumns({

        }),
        pagination: {
          pageSize: 5
        }
      };

  }
  });

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
  top:80%;
  left:70%;
  align-items: center;
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
.custom-table {
        position:absolute;
        width:40%;
        left:30%;
        top:60%;
        transform: translate(0,-50%);
        margin-top: -40px;
 /* 举例：设置上边距 */
  }
  </style>