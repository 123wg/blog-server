const CODE = {
    SUCCESS: 200,
    ERROR: 401,
}

function resp(status,code,msg,data) {
    return {
        success:false || status,
        code: 200 || code,
        msg:'' || msg,
        data: null || data
    }
}

module.exports= {resp,CODE};