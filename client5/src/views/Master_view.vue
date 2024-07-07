
<template>
    <div class="login-container" v-show="isAllComponentsVisible">
      <child-component></child-component>
        <div class="img1">
            <img src="../medias/login.png" >
      </div>

      <n-space vertical :size="30">
      
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
                <n-input v-model:value="Author"  placeholder="请输入作者"/>
              </n-form-item-row>
              <n-form-item-row label="分类">
                <n-input v-model:value="BookNum"  placeholder="请输入分类"/>
              </n-form-item-row>
              <n-form-item-row label="价格">
                <n-input v-model:value="BookLocation" placeholder="请输入价格"/>
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
      const isAllComponentsVisible2 = ref(false);

      const Bookname=ref('')
      const Author=ref('')
      const BookNum=ref('')
      const BookLocation=ref('')
      //数据库的数据传递变量
      const data1=ref([]);
      const data=ref([]);
      const fetchData = async () => {
      try {
        const response = await axios.get("/book/_token/admin/list"); // 发送 GET 请求到API
        if (response.data.code === 200) {
          data1.value = response.data.rows; // 将响应数据赋值给 data
         
          console.log(data1.value)
          data1.value.forEach((item,index)=>{
        const newItem={
          key:index,
          name:item.title,
          age:item.author,
          num:item.category,
          address:item.price
        };
        data.value.push(newItem);
      });
      console.log(data.value);
        } else {
          message.error("查询失败: " + response.data.msg);
        }
      } catch (error) {
        message.error("网络请求失败: " + error.message);
      }
    };
    fetchData();
    // 新增 deleteBook 函数用于处理删除操作
const deleteBook = async (rowData) => {
  const { name:title } = rowData; // 假设你要根据书名来删除记录
  console.log(rowData.name);
  console.log(title);
  if (title) {
    try {
      const response = await axios.delete("/book/_token/admin/delete", {
        data: { title } // 将书名作为请求体发送
      });

      if (response.data.code === 200) {
        message.success(response.data.msg || "删除成功"); // 显示成功消息
       // 成功后，设置两秒的延时然后刷新页面
        setTimeout(() => {
        window.location.reload();
      }, 2000);  
      } else {
        message.error(response.data.msg || "删除失败");
      }
    } catch (error) {
      message.error("删除请求失败: " + error.message);
    }
  } else {
    message.error("书名不能为空");
  }
};

      const hideAllComponents = () => {
      isAllComponentsVisible.value = false; // 切换显示状态
      isAllComponentsVisible2.value = true;
      message.info("请输入图书信息。");

      };
    
    const submit =async()=>{
      try {
    // 使用 axios 发送 POST 请求到API
    const response = await axios.post("/book/_token/admin/add", {
      title: Bookname.value,
      author: Author.value,
      category: BookNum.value,
      price: BookLocation.value,
      publisher: '未知出版社', // 同上
      location: '未知'
    });

    // 检查响应状态
    if (response.data.code === 200) {
      console.log("书籍添加成功：", response.data.msg);
      message.success("书籍添加成功");
    // 书籍添加成功后，设置两秒的延时然后刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.error("添加失败：", response.data.msg);
      // 这里可以处理错误情况
    }
  } catch (error) {
    console.error("请求失败：", error);
    // 这里可以处理请求异常，例如网络问题
  }
    };
    const createColumns = () => {
    
    return [
      {
        title: "书名",
        key: "name",
        width: '200px'
      },
      {
        title: "作者",
        key: "age",
        width: '100px'
      },
      {
        title: "分类",
        key: "num",
        width: '100px'
      },
      {
        title: "价格",
        key: "address",
        width: '100px'
      },
      {
        title: "操作",
        key: "actions",
        width: '100px',
        render(row) {
          return h(
            NButton,
            {
              size: "small",
              onClick: () => deleteBook(row)
            },
            { default: () => "删除" }
          );
        }
      }
    ];
  };
      return {
        data1,
        data:data,
        isAllComponentsVisible,
        isAllComponentsVisible2,
        hideAllComponents,
        Bookname,
        Author,
        BookNum,
        BookLocation,
        submit,
        deleteBook,
      
        columns: createColumns(),
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