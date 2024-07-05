
<template>
    <div class="login-container">
      <child-component></child-component>
        <div class="img1">
            <img src="../medias/login.png" >
      </div>
      <div class="scroll-container">
        
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
    <div class="search-container">
        
        <button class="search-button" @click="performSearch">创建</button>
      </div>
    </div>

  </template>
  
  <script>
  import { h, defineComponent } from "vue";
  import { NTag, NButton, useMessage } from "naive-ui";
  
  import ChildComponent from "./Test.vue";
  function performSearch() {

}
  const createColumns = ({
    sendMail
  }) => {
    return [
      {
        title: "书名",
        key: "name"
      },
      {
        title: "作者",
        key: "age"
      },
      {
        title: "数量",
        key: "num"
      },
      {
        title: "位置",
        key: "address"
      },
      {
        title: "操作",
        key: "actions",
        render(row) {
          return h(
            NButton,
            {
              size: "small",
              onClick: () => sendMail(row)
            },
            { default: () => "修改" }
          );
        }
      }
    ];
  };
  //数据库待传参
  const createData = () => [
    {
      key: 0,
      name: "茶馆",
      age: "老舍",
      num:10,
      address: "津南中心馆",
    },
    {
      key: 1,
      name: "老人与海",
      age: "海明威",
      num:6,
      address: "八里台逸夫馆",
    },
    {
      key: 2,
      name: "生活是很好玩的",
      age: "汪曾祺",
      num:5,
      address: "津南中心馆",
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
  .login-container{
      
      height:100vh;
      background-color:rgb(196,213, 209);
      position:relative;
      text-align: center;
  }
  .img1{
      text-align: center;
      display: flex;
      align-items: center;
      position:absolute;
      left:50%;
      transform: translate(-50%,0);
  }
  .img1 img{
      margin: 0 auto;
      
  }
  .custom-table {
        position:absolute;
        width:60%;
        left:20%;
        top:55%;
        transform: translate(0,-50%);
        margin-top: -40px;
 /* 举例：设置上边距 */
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
  </style> 