var express = require('express');
var router = express.Router();
const User = require('../db/model/user');
const {createToken,checkToken} = require('../utils/jwt');
// 加密依赖
const bcrypt = require('bcryptjs');
const {resp,CODE}  = require('../utils/response');
/* GET users listing. */
router.post('/login', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    if(username==='' || password === '') {
      res.send(resp(false,CODE.ERROR,'用户名密码不正确'));
    }else{
        User.findOne({username:username},(err,data)=> {
          if(err) {
            res.send(resp(false,CODE.ERROR,'用户名不存在'));
          }else {
            const user = data;
            const has = bcrypt.compareSync(password,user.password);
            if(has) {
              const token = createToken({login:true,name:user.username});
              res.send(resp(true,CODE.SUCCES,'登录成功',{token:token}));
            }else {
              res.send(resp(false,CODE.ERROR,'密码错误'));
            }
          }
      })
    }
});

router.post('/regist',(req,res)=>{
  let salt = bcrypt.genSaltSync(10); //设置加密等级
  let username = req.body.username;
  let password = req.body.password;
  if(username==='' || password ==='') {
    res.send(resp(false,CODE.ERROR,'用户名或密码不能为空'));
  }
  let hash = bcrypt.hashSync(password,salt);
  const user = {
    username:username,
    password:hash,
  }
  User.insertMany(user,(err,data)=> {
    if(err) {
      res.send(resp(false,CODE.ERROR,'注册失败'));
    }else {
      res.send(resp(true,CODE.SUCCESS,'注册成功'));
    }
  })
})

module.exports = router;
