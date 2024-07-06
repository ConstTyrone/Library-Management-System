const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")//node uuid
const { db, genid } = require("../db/DbUtils")

//登录路由
router.post("/login", async (req, res) => {

    let { account, password } = req.body;
    let { err, rows } = await db.async.all("SELECT * FROM `User` WHERE `account` = ? AND `password` = ?", [account, password])

    if (err == null && rows.length > 0) {

        let login_token = uuidv4();
        let update_token_sql = "UPDATE `User` SET `token` = ?, `last_login_time`=? where `id` = ?"
        let last_login_time = new Date().getTime();
        await db.async.run(update_token_sql,[login_token,last_login_time,rows[0].id])

        let admin_info = rows[0]
        admin_info.token = login_token
        admin_info.password = ""//不返回

        res.send({
            code: 200,
            msg: "登录成功",
            data:admin_info
        })
    } else {
        res.send({
            code: 500,
            msg: "登录失败"
        })
    }

})

//管理员管理的创建账户路由，可以创建管理员或者读者账户
router.put("/_token/admin/add", async (req, res) => {

    try{
        let { account, password,identity } = req.body;
        let { err, rows } = await db.async.all("select * from `User` where `account` = ?", [account])
        if (err != null || rows.length > 0) {
            console.log(err)
            res.send({
                code: 500,
                msg: "创建失败：账户已存在"
            })
            return;
        }
        let id = genid.NextId();
        const insert_sql = "INSERT INTO `User` (`id`,`account`,`password`,`identity`) VALUES (?,?,?,?)"
        let params = [id,account,password,identity]
        await db.async.run(insert_sql, params)

        const insert_sql2 = "INSERT INTO `Reader` (`cardid`) VALUES (?)"
        let params2 = [id]
        await db.async.run(insert_sql2, params2)

        res.send({
            code: 200,
            msg: "创建成功"
        })
    }catch(error){
        console.log(error)
        res.send({
            code: 500,
            msg: "创建失败：请联系管理员"
        })
    }

})

//管理员管理的查询所有账户路由
router.get("/_token/admin/list", async (req, res) => {
    const search_sql = "SELECT * FROM `User` ORDER BY `last_login_time` DESC"

    let { err, rows } = await db.async.all(search_sql, [])

    if (err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            rows //rows:rows
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

})

//管理员管理的更新账户账号密码身份路由
router.put("/_token/admin/update", async (req, res) => {

    let { id, account, password, identity } = req.body
    let { err, rows } = await db.async.all("select * from `User` where `id` = ?", [id])

    if (err == null && rows[0].account != account) {

        let { err, rows } = await db.async.all("select * from `User` where `account` = ?", [account])
        if (err != null || rows.length > 0) {
            console.log(err)
            res.send({
                code: 500,
                msg: "修改失败：账户已存在"
            })
            return;
        }
    }else if (err != null){
        console.log(err)
        res.send({
            code: 500,
            msg: "修改失败：找不到账号"
        })
        return;
    }

    const update_sql = "UPDATE `User` SET `account` = ?, `password` = ? ,`identity`= ? WHERE `id` = ? "
    let result = await db.async.run(update_sql, [account, password, identity, id])

    if (result.err == null) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        console.log(result.err)
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }

})

//用户的更新账户账号密码路由，需确认只能修改本人的账户
router.put("/_token/update", async (req, res) => {

    let { token } = req.headers;
    let { id, account, password } = req.body

    try{
        let user_info_sql = "SELECT * FROM `User` WHERE `token` = ?"
        let userInfoResult = await db.async.all(user_info_sql, [token])
        const user = userInfoResult.rows[0];
        const real_id = user.id;

        if (real_id != id) {
            res.status(403).send({
                code: 403,
                msg: "无权修改他人账户信息"
            });
            return;
        }
    }catch (error) {
        // 如果Token解析出错，返回错误信息
        res.status(401).send({
            code: 401,
            msg: "无效的Token"
        });
        return;
    }

    let { err, rows } = await db.async.all("select * from `User` where `id` = ?", [id])

    if (err == null && rows[0].account != account) {//没有错误且更改了账户名

        let { err, rows } = await db.async.all("select * from `User` where `account` = ?", [account])
        if (err != null || rows.length > 0) {
            console.log(err)
            res.send({
                code: 500,
                msg: "修改失败：账户已存在"
            })
            return;
        }
    }else if (err != null){
        console.log(err)
        res.send({
            code: 500,
            msg: "修改失败：找不到账号"
        })
        return;
    }

    const update_sql = "UPDATE `User` SET `account` = ?, `password` = ? WHERE `id` = ? "
    let result = await db.async.run(update_sql, [account, password, id])

    if (result.err == null) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }    

})

//用户的注销账户路由，需确认只能注销本人的账户
router.delete("/_token/delete", async (req, res) => {

    let { token } = req.headers;
    let { id } = req.body    

    try{
        let user_info_sql = "SELECT * FROM `User` WHERE `token` = ?"
        let userInfoResult = await db.async.all(user_info_sql, [token])
        const user = userInfoResult.rows[0];
        const real_id = user.id;

        if (real_id != id) {
            res.status(403).send({
                code: 403,
                msg: "无权注销他人账户"
            });
            return;
        }
    }catch (error) {
        // 如果Token解析出错，返回错误信息
        res.status(401).send({
            code: 401,
            msg: "无效的Token"
        });
        return;
    }

    const delete_sql = "DELETE FROM `User` WHERE `id` = ? "
    let result = await db.async.run(delete_sql, [id])

    const delete_sql2 = "DELETE FROM `Reader` WHERE `cardid` = ? "
    let result2 = await db.async.run(delete_sql2, [id])

    if (result.err == null && result2.err == null) {
        res.send({
            code: 200,
            msg: "注销成功"
        })
    } else {
        console.log(result.err)
        console.log(result2.err)
        res.send({
            code: 500,
            msg: "注销失败"
        })
    }    

})

module.exports = router