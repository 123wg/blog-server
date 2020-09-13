const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var ArticleSchema = new mongoose.Schema({
    title:{required:true,type:String,unique:true,dropDups: true}, // 文章名称
    typeId:{
        required:true,
        type:Schema.Types.ObjectId,
        ref: 'type'
    }, // 类型id
    mdContent:{required:true,type:String},  // md内容
    abstract:{required:true,type:String},// 文章摘要
    htmlContent:{required:true,type:String}, // html内容
    createTime:{required:true,type:String},
    updateTime:{required:true,type:String},
    coverId:{
        required:true,
        type:Schema.Types.ObjectId,
        ref: 'file'
    }, // 封面图片id
},
{
    versionKey: false,//去掉版本锁 __v0
})
ArticleSchema.plugin(mongoosePaginate);
// 返回数据映射为id
ArticleSchema.options.toJSON  = {
    transform(doc, ret, options) {
	    virtuals: true,
        ret.id = doc.id;
        delete ret._id;
        return ret;
    }
};
var Article = mongoose.model('article',ArticleSchema);
module.exports = Article;