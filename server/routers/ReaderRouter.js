const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")//node uuid
const { db, genid } = require("../db/DbUtils")

// 删除接口 /book/_token/admin/delete?id=xxx  删除后将查找不到有关读者信息，请确保在User中删除读者信息
// 管理员删除读者信息
router.delete("/_token/admin/delete", async (req, res) => {//  /_token/delete
    
    let { cardid } = req.body;
    const delete_sql = "DELETE FROM `Reader` WHERE `cardid` = ?"
    let result = await db.async.run(delete_sql, [cardid])
    if(result.err==null){
        res.send({
            code: 200,
            msg: "删除成功"
        })
    }else{
        console.log(result.err)
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }
    
})

//修改读者信息 读者修改自己的
router.put("/_token/update", async (req, res) => {//  /_token/update

    let { cardid, name, gender, unit, type } = req.body;
    let { token } = req.headers;

    try{
        let user_info_sql = "SELECT * FROM `User` WHERE `token` = ?"
        let userInfoResult = await db.async.all(user_info_sql, [token])
        const user = userInfoResult.rows[0];
        const real_id = user.id;

        if (real_id != cardid) {
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

    const update_sql = "UPDATE `Reader` SET `name`=?,`gender`=?,`unit`=?,`type`=? WHERE `cardid` = ?"
    let params = [name,gender,unit,type,cardid]
    let result = await db.async.run(update_sql, params)

    if(result.err==null){
        res.send({
            code: 200,
            msg: "修改个人信息成功"
        })
    }else{
        console.log(result.err)
        res.send({
            code: 500,
            msg: "修改个人信息失败"
        })
    }

})

//获取读者信息 读者查看自己的
router.get("/_token/get", async (req, res) => {//  /_token/get

    let { token } = req.headers;

    try{    
        let user_info_sql = "SELECT * FROM `User` WHERE `token` = ?"
        let userInfoResult = await db.async.all(user_info_sql, [token])
        const user = userInfoResult.rows[0];
        const cardid = user.id;        

        const get_sql = "SELECT * FROM `Reader` WHERE `cardid` = ?"
        let params = [cardid]
        let result = await db.async.all(get_sql, params)

        if(result==null){
            res.status(404).send({
                code: 404,
                msg: "读者信息不存在"
            })
        }else{
            res.send({
                code: 200,
                data: result
            })
        }
    }catch (error) {
        // 如果Token解析出错，返回错误信息
        console.log(error)
        res.status(401).send({
            code: 401,
            msg: "无效的Token"
        });
        return;
    }

})

module.exports=router