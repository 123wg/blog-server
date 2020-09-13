const jwt  = require('jsonwebtoken');
const scrict = 'jskndjj.sdf,s;fspsdfjkadklef';

// 创建token
function createToken(payload) {
    // 创建时间
    payload.ctime = Date.now();
    payload.exp = Math.floor(Date.now() / 1000) + (60 * 60*24*7);
    return jwt.sign(payload,scrict);
};

// 验证token
function checkToken(token) {
    return new Promise((resolve,reject)=>{
        jwt.verify(token,scrict,(err,data)=>{
            if(err) {
                reject('token验证失败');
            }
            resolve(data);
        })
    })
};
module.exports = {
    createToken,
    checkToken
}