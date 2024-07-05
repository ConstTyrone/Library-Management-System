<!--本页的设计和原理参照文档：https://www.naiveui.com/zh-CN/light/components/form  -->
<template>
  <div class="login-container">
    <child-component></child-component>
    <div class="img1">
      <img src="../medias/login.png" />
    </div>

    <div class="login-panel">
      <n-card class="rounded-card" title="欢迎使用图书管理系统">
        <n-tabs
          default-value="signin"
          size="large"
          justify-content="space-evenly"
        >
          <n-tab-pane name="signin" tab="登录">
            <n-form>
              <n-form-item-row label="用户名">
                <n-input v-model:value="loginAccount" placeholder="请输入账号"/>
              </n-form-item-row>
              <n-form-item-row label="密码">
                <n-input v-model:value="loginPassword" type="password" placeholder="请输入密码"/>
              </n-form-item-row>
            </n-form>
            <n-button @click="login" type="primary" block secondary strong>
              登录
            </n-button>
          </n-tab-pane>
          <n-tab-pane name="signup" tab="注册">
            <n-form>
              <n-form-item-row label="用户名">
                <n-input />
              </n-form-item-row>
              <n-form-item-row label="密码">
                <n-input />
              </n-form-item-row>
              <n-form-item-row label="重复密码">
                <n-input />
              </n-form-item-row>
            </n-form>
            <n-button @click="register" type="primary" block secondary strong>
              注册
            </n-button>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ChildComponent from "./Test.vue";
export default {
  components: {
    ChildComponent,
  },
  data() {
    return {
      loginAccount: "",
      loginPassword: "",
      createAccount: "",
      createPassword: "",
      createIdentity: "",
      updateId: "",
      updateAccount: "",
      updatePassword: "",
      updateIdentity: "",
      accounts: [],
      token: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("/user/login", {
          account: this.loginAccount,
          password: this.loginPassword,
        });
        if (response.data.code === 200) {
          console.log(this.loginAccount);
          console.log(this.loginPassword);
          this.token = response.data.data.token;
          alert("Login successful");
          this.$router.push("/user");
        } else {
          alert("Login failed");
        }
      } catch (error) {
        alert("Login error");
      }
    },
  },
};
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
  top: 60%;
  transform: translate(0, -50%);
  margin-top: -40px;
  // margin-top:130px;
}

.login-panel title {
  font-weight: bolder;
}
.n-button {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  padding: 20px 160px;
}
.img1 {
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
.rounded-card {
  border-radius: 8px; /* 可根据需要调整圆角的大小 */
}
</style>
