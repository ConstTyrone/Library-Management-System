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
  
  
  function performSearch() {

  }
  import { h, defineComponent } from "vue";
  import { NTag, NButton, useMessage } from "naive-ui";
  

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

    //   {
    //     title: "操作",
    //     key: "actions",
    //     render(row) {
    //       return h(
    //         NButton,
    //         {
    //           size: "small",
    //           onClick: () => sendMail(row)
    //         },
    //         { default: () => "修改" }
    //       );
    //     }
    //   }
    ];
  };
  //数据库待传参
  const createData = () => [
    {
      key: 0,
      name: "abcde",
      age: "12345",
    },
    {
      key: 1,
      name: "fghij",
      age: "6789",
    },
    {
      key: 2,
      name: "nkcs",
      age: "15973",
    }
  ];
  
  export default defineComponent({
    components: {
    ChildComponent,
  },
    setup() {
      const message = useMessage();
      return {
        data: createData(),
        columns: createColumns({
          sendMail(rowData) {
            message.info("send mail to " + rowData.name);
          }
        }),
        pagination: {
          pageSize: 10
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
        left:29%;
        top:55%;
        transform: translate(0,-50%);
        margin-top: -40px;
 /* 举例：设置上边距 */
  }
  </style>