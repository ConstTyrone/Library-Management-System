const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require("uuid")//node uuid
const { db, genid } = require("../db/DbUtils")

//管理员添加书籍，书籍名必须有，借阅状态默认为可借阅（1）
router.post("/_token/admin/add", async (req, res) => {

    let { title, author, category, price, publisher, location } = req.body;
    if( title == null){
        res.send({
            code: 500,
            msg: "添加失败：书名不能为空"
        })
        return;
    }

    let bookid = genid.NextId();
    const insert_sql = "INSERT INTO `Book` (`bookid`,`title`,`author`,`category`,`price`,`publisher`,`location`,`borrowable`) VALUES (?,?,?,?,?,?,?,?)"
    let params = [ bookid, title, author, category, price, publisher, location, 1 ]
    let result = await db.async.run(insert_sql, params)//异步执行SQL插入操作

    if(result.err != null){
        console.log(result.err)
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }
    else{
        res.send({
            code: 200,
            msg: "添加成功"
        })
    }
    
})

//管理员查询所有的书  注意此项会返回所有的书，在书籍数量大时非常消耗性能，所以设成管理员才能查，但也需慎重
router.get("/_token/admin/list", async (req, res) => {

    const search_sql = "SELECT `bookid`,`title`,`author`,`category`,`price`,`publisher`,`location`,`borrowed_time`,`borrowable` FROM `Book` ORDER BY `borrowed_time` DESC"
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

//查询 包含模糊查询
//目前只支持子查询title和borrowable，其他的如果要增加我再改
//虽然后端对传入数据的类型做了一定的限制，但前端必须做出更严谨的限制（重要）
router.get("/_token/search", async (req, res) => {
    /**
     * keyword 关键字  在title中查找
     * borrowable 0/1  1可借阅 0已被借阅
     * 
     * 分页： 
     * page 页码
     * pageSize 分页大小
     * //分页的传给前端定制  事实上有点无关紧要
     */
    let { keyword, borrowable, page, pageSize } = req.query//query和body不一样！

    page = page == null ? 1 : page;//增加默认值
    pageSize = pageSize == null ? 5 : pageSize//默认每页5本书

    keyword = keyword == null ? "" : keyword

    let params = []//查询参数
    let whereSqls = []//查询语句的条件


    if (keyword != "") {
        whereSqls.push(" (`title` LIKE ? ) ")//查title
        params.push("%" + keyword + "%")
    }

    borrowable = parseInt(borrowable);
    if (borrowable == 0 || borrowable == 1){
        whereSqls.push(" (`borrowable` = ? ) ")//查是否可借阅
        params.push(borrowable)
    }

    let whereSqlStr = ""//拼装查询语句
    if (whereSqls.length > 0) {
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")//事实上不会拼接
    }

    //查分页数据 时间排序
    let searchSql = " SELECT `bookid`,`title`,`author`,`category`,`price`,`publisher`,`location`,`borrowed_time`,`borrowable` FROM `Book` " + whereSqlStr + " ORDER BY `borrowed_time` DESC LIMIT ?,? "
    // 1 10  2,10    3,5
    // 0,10  10,10   10,5
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])//分页 每页有多少 

    //查询数据总数
    let searchCountSql = " SELECT count(*) AS `count` FROM `Book` " + whereSqlStr;
    let searchCountParams = params

    //分页数据
    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let countResult = await db.async.all(searchCountSql, searchCountParams)

    console.log(searchSql, countResult)

    if (searchResult.err == null && countResult.err == null) {
        res.send({//返回给前端
            code: 200,
            msg: "查询成功",
            data: {
                keyword,
                page,
                pageSize,
                rows: searchResult.rows,
                count: countResult.rows[0].count
            }
        })

    } else {
        res.send({
            code: 500,
            msg: "查询失败",
        })
    }

})

// 删除接口 /book/_token/admin/delete?id=xxx
router.delete("/_token/admin/delete", async (req, res) => {//  /_token/delete
    
    let { bookid } = req.body;
    const delete_sql = "DELETE FROM `Book` WHERE `bookid` = ?"
    let result = await db.async.run(delete_sql, [bookid])
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

//管理员修改书籍信息，除了最近一次借阅时间都能改
router.put("/_token/admin/update", async (req, res) => {//  /_token/update

    let { bookid, title, author, category, price, publisher, location, borrowable } = req.body;
    if( borrowable != 1 && borrowable != 0 ){
        res.send({
            code: 500,
            msg: "修改失败：借阅状态错误"
        })
        return;
    }

    const update_sql = "UPDATE `Book` SET `title`=?,`author`=?,`category`=?,`price`=?,`publisher`=?,`location`=?,`borrowable`=? WHERE `bookid` = ?"
    let params = [title,author,category,price,publisher,location,borrowable,bookid]
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

//读者借阅/归还图书
router.put("/_token/borrow", async (req, res) => {//  /_token/borrow

    let { bookid,id } = req.body;//这里有id被修改的风险 最好先结合token验证
    let borrowable;
    try{
        const select_sql = "SELECT `borrowable` FROM `Book` WHERE `bookid` = ? "
        let result2 = await db.async.all(select_sql, [bookid])
        borrowable = result2.rows[0].borrowable;
        //console.log(borrowable)
    }catch(error){
        console.log(error)
        res.send({
            code: 500,
            msg: "借阅状态未知"
        })
        return;
    }

    if( borrowable != 1 && borrowable != 0 ){
        res.send({
            code: 500,
            msg: "借阅状态错误"
        })
        return;
    }

    if( borrowable == 1 ){
        try{
            const update_sql = "UPDATE `Book` SET `borrowable` = ? WHERE `bookid` = ?"
            let params = [0,bookid]
            let result = await db.async.run(update_sql, params)

            //插入借书表
            const insert_sql = "INSERT INTO `CurrentLoan` (`bookid`,`cardid`,`loan_date`) VALUES (?,?,?)"
            let time = new Date().getTime();
            let result2 = await db.async.run(insert_sql, [bookid,id,time])

            if(result.err == null && result2.err == null ){
                res.send({
                    code: 200,
                    msg: "借阅成功"
                })
            }else{
                console.log(result.err+" "+result2.err)
                res.send({
                    code: 500,
                    msg: "借阅失败：请联系管理员处理"
                })
            }
        }catch(error){
            console.log(error)
            res.send({
                code: 500,
                msg: "借阅失败"
            })
        }
    }
    
    else{
        try{
            const update_sql = "UPDATE `Book` SET `borrowable` = ? WHERE `bookid` = ?"
            let params = [1,bookid]
            let result = await db.async.run(update_sql, params)

            //查找原有借书表中的信息
            const select_sql = "SELECT * FROM `CurrentLoan` WHERE `bookid` = ?"
            let result3 = await db.async.all(select_sql,[bookid])//需确保借阅信息表中书的唯一性
            //console.log(result3.rows)
            let loan_date = result3.rows[0].loan_date;

            //插入归还表
            const insert_sql = "INSERT INTO `ReturnedLoan` (`bookid`,`cardid`,`loan_date`,`returned_date`) VALUES (?,?,?,?)"
            let time = new Date().getTime();
            let result2 = await db.async.run(insert_sql, [bookid,id,loan_date,time])

            //删除原有借书表中信息
            const delete_sql = "DELETE FROM `CurrentLoan` WHERE `bookid` = ?"
            let result4 = await db.async.run(delete_sql,[bookid])
            
            if(result.err == null && result2.err == null && result3.err == null && result4.err == null ){
                res.send({
                    code: 200,
                    msg: "归还成功"
                })
            }else{
                console.log(result.err+" "+result2.err+" "+result3.err+" "+result4.err)
                res.send({
                    code: 500,
                    msg: "归还失败：请联系管理员处理"
                })
            }
        }catch(error){
            console.log(error)
            res.send({
                code: 500,
                msg: "归还失败"
            })
        }
    }

})

module.exports=router