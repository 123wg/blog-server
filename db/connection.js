/*
 * @Description: 和数据库连接相关的操作
 * @Author: wanggang
 * @Date: 2020-03-25 20:38:17
 */
const mongoose = require('mongoose');
// {useNewUrlParser: true} 解决可以连接但是有警告的问题
mongoose.connect("mongodb://localhost/myblog",{useNewUrlParser: true,useCreateIndex:true});
var db = mongoose.connection;
db.on("error",console.error.bind(console,'连接失败'));
db.on('open',()=> {
    console.log('数据库连接成功');
})