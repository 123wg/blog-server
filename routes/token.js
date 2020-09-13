const express = require('express');
var router = express.Router();
const {checkToken} = require('../utils/jwt');
const {resp,CODE}  = require('../utils/response');
router.get('/check',(req,res)=>{
    // 验证token合法性
    const token = req.query.token;
    checkToken(token)
    .then(()=> {
        res.send(resp(true,CODE.SUCCESS,'验证成功'));
    })
    .catch(()=>{
        res.send(resp(false,CODE.ERROR,'验证失败'));
    })
})

module.exports = router;