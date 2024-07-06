
<template>
    <div class="login-container" v-show="isAllComponentsVisible">
      <child-component></child-component>
        <div class="img1">
            <img src="../medias/login.png" >
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
        
        <button class="search-button" @click="hideAllComponents">新增</button>
      </div>
  </div>
 
  <div class="login-container" v-show="isAllComponentsVisible2">
    <div class="img1">
      <img src="../medias/login.png" />
    </div>

    <div class="login-panel">
      <n-card class="rounded-card" title="">
        <n-tabs
          default-value="signin"
          size="large"
          justify-content="space-evenly"
        >
          <n-tab-pane name="signin" tab="添加图书">
            <n-form>
              <n-form-item-row label="书名">
                <n-input v-model:value="Bookname" placeholder="请输入书名"/>
              </n-form-item-row>
              <n-form-item-row label="作者">
                <n-input v-model:value="Author" type="password" placeholder="请输入作者"/>
              </n-form-item-row>
              <n-form-item-row label="数量">
                <n-input v-model:value="BookNum" type="password" placeholder="请输入数量"/>
              </n-form-item-row>
              <n-form-item-row label="地址">
                <n-input v-model:value="BookLocation" type="password" placeholder="请输入地址"/>
              </n-form-item-row>
            </n-form>
            <n-button @click="submit" type="primary" block secondary strong>
              提交
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>


  </template>
  
  <script>
  import axios from "axios";
  import { h, defineComponent,ref } from "vue";

  import { NSpace, NDataTable, NTag, NButton, useMessage } from 'naive-ui';
 
  import ChildComponent from "./Test.vue";
  
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
    },
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
    NSpace,
    NDataTable,
    NTag,
    NButton
  },
    setup() {
      const message = useMessage();
      const isAllComponentsVisible = ref(true);
      const isAllComponentsVisible2 = ref(true);

      const Bookname=ref('')
      const Author=ref('')
      const BookNum=ref('')
      const BookLocation=ref('')
      
      const hideAllComponents = () => {
      isAllComponentsVisible.value = false; // 切换显示状态
      isAllComponentsVisible2.value = true;
      message.info("所有组件已隐藏。");
    };
    const submit =()=>{
      console.log(Bookname.value);
      console.log(Author.value);
      console.log(BookNum.value);
      console.log(BookLocation.value);
    };
      return {

        isAllComponentsVisible,
        isAllComponentsVisible2,
        hideAllComponents,
        Bookname,
        Author,
        BookNum,
        BookLocation,
        submit,
        data: createData(),
        columns: createColumns({
          sendMail(rowData) {
            message.info("send mail to " + rowData.name);
          }
        }),
        pagination: {
          pageSize: 5
        }
      };

    }
  });

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
.rounded-card {
  border-radius: 8px; /* 可根据需要调整圆角的大小 */
}
.n-button {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  padding: 20px 160px;
}
  </style> 