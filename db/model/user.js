const mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    username:{required:true,type:String},
    password:{required:true,type:String},
},{
    versionKey:false,
});
UserSchema.options.toJSON  = {
    transform(doc, ret, options) {
	    virtuals: true,
        ret.id = doc.id;
        delete ret._id;
        return ret;
    }
};

var User = mongoose.model('user',UserSchema);
module.exports = User;
