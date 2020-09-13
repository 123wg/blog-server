const mongoose = require('mongoose');
var fileSchema = new mongoose.Schema({
    name:{required:true,type:String},
    oldName:{required:true,type:String},
    path:{required:true,type:String},
    createTime:{required:true,type:String},
})
var File = mongoose.model('file',fileSchema);
module.exports = File;