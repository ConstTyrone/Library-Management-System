const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")//node uuid
const { db, genid } = require("../db/DbUtils")

//管理员查询所有的借阅记录  注意此项会返回所有的记录，在记录数量大时非常消耗性能，所以设成管理员才能查，但也需慎重
router.get("/_token/admin/list", async (req, res) => {

    const search_sql = "SELECT * FROM `CurrentLoan` ORDER BY `loan_date` DESC"
    let { err, rows } = await db.async.all(search_sql, [])

    if (err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            rows //rows:rows
        })
    } else {
        console.log(err)
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

})

//查询 支持子查询bookid和cardid
router.get("/_token/search", async (req, res) => {
    /**
     * bookid 被借阅的书查询 我感觉一般不会查这个
     * cardid 按读者查询
     * 
     * 分页： 
     * page 页码
     * pageSize 分页大小
     * //分页的传给前端定制  事实上有点无关紧要
     */
    let { bookid, cardid, page, pageSize } = req.query//query和body不一样！

    page = page == '' ? 1 : page;//增加默认值
    pageSize = pageSize == '' ? 5 : pageSize//默认每页5本书

    let params = []//查询参数
    let whereSqls = []//查询语句的条件

    if ( bookid != '' ){
        whereSqls.push(" (`bookid` = ? ) ")
        params.push(bookid)
    }

    if ( cardid != '' ){
        whereSqls.push(" (`cardid` = ? ) ")
        params.push(cardid)
    }

    let whereSqlStr = ""//拼装查询语句
    if (whereSqls.length > 0) {
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")
    }

    //查分页数据 时间排序
    let searchSql = " SELECT * FROM `CurrentLoan` " + whereSqlStr + " ORDER BY `loan_date` DESC LIMIT ?,? "
    // 1 10  2,10    3,5
    // 0,10  10,10   10,5
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])//分页 每页有多少 

    //查询数据总数
    let searchCountSql = " SELECT count(*) AS `count` FROM `CurrentLoan` " + whereSqlStr;
    let searchCountParams = params

    //分页数据
    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let countResult = await db.async.all(searchCountSql, searchCountParams)

    console.log(searchSql, searchSqlParams)

    if (searchResult.err == null && countResult.err == null) {
        res.send({//返回给前端
            code: 200,
            msg: "查询成功",
            data: {
                bookid,
                cardid,
                page,
                pageSize,
                rows: searchResult.rows,
                count: countResult.rows[0].count
            }
        })

    } else {
        console.log(searchResult.err)
        console.log(countResult.err)
        res.send({
            code: 500,
            msg: "查询失败",
        })
    }

})

// 删除接口 /book/_token/admin/delete?id=xxx  非常不建议删除！！！这个路由只是写在这，前端我认为不必增加这个删除功能
router.delete("/_token/admin/delete", async (req, res) => {
    
    let { bookid, cardid, loan_date } = req.body;
    const delete_sql = "DELETE FROM `CurrentLoan` WHERE `bookid` = ? AND `cardid` = ? AND `loan_date` = ?"
    let result = await db.async.run(delete_sql, [bookid,cardid,loan_date])
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

//管理员修改借阅信息  非常不建议修改！！！这个路由只是写在这，前端我认为不必增加这个修改功能
//bookid, cardid, loan_date 共同确定唯一的借书记录，所以需要传入新值来重新赋值
router.put("/_token/admin/update", async (req, res) => {//  /_token/update

    let { bookid, cardid, loan_date, bookid_new, cardid_new, loan_date_new } = req.body;
    const update_sql = "UPDATE `CurrentLoan` SET `bookid`=? , `cardid` = ? , `loan_date` = ? WHERE `bookid` = ? AND `cardid` = ? AND `loan_date` = ?"
    let params = [ bookid_new, cardid_new, loan_date_new, bookid, cardid, loan_date ]
    let result = await db.async.run(update_sql, params)

    if(result.err==null){
        res.send({
            code: 200,
            msg: "修改成功"
        })
    }else{
        console.log(result.err)
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }

})


module.exports=router