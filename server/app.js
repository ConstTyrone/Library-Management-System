/*
"multer" 
"sqlite3" 
"uuid" 
*/
const express=require("express")
const multer=require("multer")
const app=express();
const port=8080
const path=require("path")
const { db, genid } = require("./db/DbUtils")


//开放跨域请求
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});

app.use(express.json())//中间键

const update = multer({
    dest:"./public/upload/temp"
})
app.use(update.any())// 使用Multer中间件处理所有的文件上传请求 这将匹配所有路由，并接收任何类型的文件上传
//指定静态资源路径
app.use(express.static(path.join(__dirname,"public")))

const ADMIN_TOKEN_PATH = "/_token"

app.all("*", async (req, res, next) => {
    // 检查请求路径是否为管理员Token路径
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {

        let { token } = req.headers;

        // 更改SQL查询语句，从数据库中获取用户信息及其角色
        let user_info_sql = "SELECT * FROM `User` WHERE `token` = ?"
        let userInfoResult = await db.async.all(user_info_sql, [token])

        // 检查查询结果是否存在错误或用户不存在
        if (userInfoResult.err != null || userInfoResult.rows.length == 0) {
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return;
        } else {
            const user = userInfoResult.rows[0];
            const roles = user.identity;

            // 检查用户是否具有访问请求资源所需的权限
            if (req.path.includes("/admin") && !roles.includes("admin")) {
                // 如果是/admin路径且用户不是管理员，拒绝访问
                res.send({
                    code: 403,
                    msg: "您没有权限访问此资源"
                });
                return;
            }

            // 如果用户具有相应权限，继续处理请求
            next();
        }
    } else {
        next()
    }
})


app.use("/test",require("./routers/TestRouter"))// 加载TestRouter模块，用于处理/test相关的路由请求
app.use("/user",require("./routers/UserRouter"))
app.use("/book",require("./routers/BookRouter"))
app.use("/current",require("./routers/CurrentLoanRouter"))
app.use("/returned",require("./routers/ReturnedLoanRouter"))
//app.use("/reader",require("./routers/ReaderRouter"))

app.get("/",(req,res)=>{
    res.send("helloworld")
})

app.listen(port,()=>{
    console.log(`启动成功：http://localhost:${port}/`);
    //open(`http://localhost:${port}`); // 使用open库自动打开浏览器到指定URL
})


