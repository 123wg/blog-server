const express = require('express');
var router = express.Router();
const Type = require('../db/model/type');
const {resp,CODE}  = require('../utils/response');
const {now} = require('../utils/timeConverter');
// 查询所有类型列表
router.get('/list',(req,res)=> {
    // console.log(req.query);
    const type = req.query;
    if(type.id) {
        type._id = type.id;
        delete type.id;
    }
    // 查询所有的列表
    console.log(type._id);
    Type.find(type || any,(err,data)=> {
        if(err) {
            res.send(resp(false,CODE.ERROR,'查询类型失败'));
        }else {
            res.send(resp(true,CODE.SUCCESS,'',data));
        }
    });
})
// 修改类型
router.post('/update',(req,res)=> {
    const type = req.body;
    
    Type.findByIdAndUpdate(type.id,type,(err,data)=> {
        if(err) {
            res.send(resp(false,CODE.ERROR,'修改失败'));
        }else {
            res.send(resp(true,CODE.SUCCESS,'修改成功'));
        }
    })
})
// 新增类型
router.post('/add',(req,res)=> {
    const type = req.body;
    type.createTime = now;
    type.updateTime = now;
    Type.insertMany(type)
    .then((data)=> {
        res.send(resp(true,CODE.SUCCESS,'新增成功'));
    })
    .catch(err=> {
        res.send(resp(false,CODE.ERROR,'新增类型失败'));
    })
})
// 删除类型
router.post('/del',(req,res)=> {
    if(req.query.id) {
        Type.remove({"_id":req.query.id},(err)=> {
            if(err) {
                res.send(resp(false,CODE.ERROR,'删除失败'));
            }else{
                res.send(resp(true,CODE.SUCCESS,'删除成功'));
            }
        })
    }
})
module.exports = router;