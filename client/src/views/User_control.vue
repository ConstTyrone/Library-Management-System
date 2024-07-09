<template>
    <div class="login-container" v-show="isAllComponentsVisible">
      <ChildComponent />
      <div class="img1">
        <img src="../medias/login.png" />
      </div>
      <div class="search-container">
        
        <button class="search-button" @click="hideAllComponents">创建</button>
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
    <div class="login-container" v-show="isAllComponentsVisible2">
      
      <div class="img1">
        <img src="../medias/login.png" />
      </div>
  
      <div class="login-panel">
        <n-card class="rounded-card" title="">
          <n-tabs
            default-value="signup"
            size="large"
            justify-content="space-evenly"
          >
            
            <n-tab-pane name="signup" tab="创建用户">
              <n-form>
                <n-form-item-row label="用户名">
                  <n-input v-model:value="createAccounter" placeholder="请输入账号"/>
                </n-form-item-row>
                <n-form-item-row label="密码">
                  <n-input v-model:value="createPassword" type="password" placeholder="请输入密码"/>
                </n-form-item-row>
                <n-form-item-row label="账户类型">
                  <n-input v-model:value="createIdentity" placeholder="请输入账户类型"/>
                </n-form-item-row>
              </n-form>
              <n-button @click="createAccount" type="primary" block secondary strong>
                注册
              </n-button>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </div>
    </div>
  </template>
  <script>
  import { ref } from 'vue';
  import ChildComponent from './Test.vue';
  
  import axios from 'axios'; // 确保安装了 axios

  import { h, defineComponent } from "vue";
  import { NTag, NButton, useMessage, NSpace, NDataTable } from 'naive-ui';

  


  export default defineComponent({
    // data(){
    //   token: '225c635e-dec8-4736-90b9-f250824b4854'
    // },
    components: {
    ChildComponent,
    NSpace,
    NDataTable,
    NTag,
    NButton
  },
    setup() {
      const isAllComponentsVisible = ref(true);
      const isAllComponentsVisible2 = ref(false);
      const createAccounter=ref('');
      const createPassword=ref('');
      const createIdentity=ref('');
      const token = ref('');
      const message = useMessage();
      const data1=ref([]);
      const data=ref([]);

      const fetchData = async () => {
      try {
        const response = await axios.get("/user/_token/admin/list"); // 发送 GET 请求到API
        if (response.data.code === 200) {
          data1.value = response.data.rows; // 将响应数据赋值给 data
         
          console.log(data1.value)
          data1.value.forEach((item,index)=>{
        const newItem={
          key:index,
          name:item.account,
          age:item.password
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
      // 新增 deleteUser 函数用于处理删除操作
const deleteUser = async (rowData) => {
  const { name:account } = rowData; // 假设你要根据书名来删除记录
  console.log(rowData.name);
  console.log(account);
  if (account) {
    try {
      const response = await axios.delete("/user/_token/admin/delete", {
        data: { account } // 将账户作为请求体发送
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
    message.error("账户不能为空");
  }
};

      const hideAllComponents = () => {
      isAllComponentsVisible.value = false; // 切换显示状态
      isAllComponentsVisible2.value = true;
      message.info("请输入账户信息。");

      };
      const createAccount = async () => {
      try {
        const response = await axios.put('/user/_token/admin/add', {
          account: createAccounter.value,
          password: createPassword.value,
          identity: createIdentity.value

        }, {
          headers: {
            token: token.value
          }
        });

        if (response.data.code === 200) {
          message.success('Account created successfully');
          console.log(response.data.msg);
              // 成功后，设置两秒的延时然后刷新页面
        setTimeout(() => {
        window.location.reload();
        }, 2000);
        } else {
          message.error('Account creation failed');
          console.log(response.data.msg);
        }
      } catch (error) {
        message.error('Account creation error: ' + error.message);
      }
    };
    const createColumns = () => {
    return [
      {
        title: "用户名",
        key: "name"
      },
      {
        title: "密码",
        key: "age"
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
              onClick: () => deleteUser(row)
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
        message,
        createAccounter,
        createIdentity,
        createPassword,
        createAccount,
        deleteUser,
        columns: createColumns(),
        pagination: {
          pageSize: 5
        }
      };
  },

  });
  </script>
 
  <style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background-color: rgb(196, 213, 209);
    position: relative;
  }
  .login-panel {
  position: absolute;
  width: 400px;
  margin-left: 530px;
  top: 65%;
  transform: translate(0, -50%);
  margin-top: -40px;
  // margin-top:130px;
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
  .rounded-card {
  border-radius: 8px; /* 可根据需要调整圆角的大小 */
}
  </style>