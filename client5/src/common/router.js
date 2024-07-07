
//路由
import { createRouter, createWebHashHistory } from "vue-router";

let routes = [
    { path: "/test", component: () => import("../views/Test.vue") },
    { path: "/login", component: () => import("../views/Login.vue") },
    { path: "/dashboard", component: () => import("../views/dashboard/Dashboard.vue"),children:[
        {path: "/dashboard/category", component: () =>import("../views/dashboard/Category.vue")},
        {path: "/dashboard/article", component: () =>import("../views/dashboard/Article.vue")},
    ] },
    { path: "/", component: () => import("../views/Login.vue") },
    {path:"/user",component:()=>import("../views/User_view.vue")},
    {path:"/master",component:()=>import("../views/Master_view.vue")},
    {path:"/SerchBooks",component:()=>import("../views/User_view.vue")},
    {path:"/usedOrder",component:()=>import("../views/Master_view.vue")},
    {path:"/userOrder",component:()=>import("../views/User_control.vue")}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export { router, routes };