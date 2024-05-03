/*
install:
axios   //与服务端ajax通信
pinia   //状态管理
sass    //简化css代码
vue-router  //https://router.vuejs.org/zh/installation.html
naive-ui    //https://www.naiveui.com/zh-CN/light/docs/installation
wangeditor5富文本编辑//https://www.wangeditor.com/v5/installation.html
*/ 
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'//全局安装 虽然文档不推荐
import {createPinia}from "pinia"
import {router} from './common/router'
import axios from 'axios'
import {createDiscreteApi} from 'naive-ui'//https://www.naiveui.com/zh-CN/light/components/discrete
axios.defaults.baseURL="http://localhost:8080"//配置全局路径


const { message, notification, dialog } = createDiscreteApi(['message', 'dialog', 'notification'])
const app = createApp(App)

app.provide("axios",axios)//依赖注入 全局提供
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)

app.use(naive)
app.use(createPinia())
app.use(router)


app.mount('#app')