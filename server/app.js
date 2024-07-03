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

//warehouse/_token/add
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req, res, next) => {
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {//找到了

        let { token } = req.headers;

        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminResult = await db.async.all(admin_token_sql,[token])
        if(adminResult.err != null || adminResult.rows.length == 0){
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return 
        }else{
            next()
        }
    }else{
        next()
    }
})


app.use("/test",require("./routers/TestRouter"))// 加载TestRouter模块，用于处理/test相关的路由请求
app.use("/admin",require("./routers/AdminRouter"))



app.get("/",(req,res)=>{
    res.send("helloworld")
})

app.listen(port,()=>{
    console.log(`启动成功：http://localhost:${port}/`);
    open(`http://localhost:${port}`); // 使用open库自动打开浏览器到指定URL
})


