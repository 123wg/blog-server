const mongoose = require('mongoose');
var TypeSchema = new mongoose.Schema({
    // id:{required:true,},
    name:{required:true,type:String,unique:true,dropDups: true}, // 类型名称
    createTime:{required:true,type:String}, // 创建时间
    updateTime:{required:true,type:String}, // 修改时间
    sort:{required:true,type:Number,unique:true,dropDups: true} // 排序
},{
    versionKey: false,//去掉版本锁 __v0
});
// 返回数据映射为id
TypeSchema.options.toJSON  = {
    transform(doc, ret, options) {
	    virtuals: true,
        ret.id = doc.id;
        delete ret._id;
        return ret;
    }
};

var Type = mongoose.model('type',TypeSchema);
module.exports = Type;