var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    name: {
        unique:true,
        type:String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
}, {collection: 'user'})
UserSchema.pre('save', function (next) {
    var _this = this
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment().format('YYYY-MM-DD hh:mm:ss')
    }
    else {
        this.meta.updateAt = moment().format('YYYY-MM-DD hh:mm:ss')
    }
    bcrypt.genSalt(10,function(err,salt){
        if(err) console.log(err)
        bcrypt.hash(_this.password,salt,function(err,hash){
            if(err) console.log(err)
            _this.password = hash;
            next()
        })
    })
})
UserSchema.methods = {
    comparePassword:function(_pwd,cb){
        bcrypt.compare(_pwd,this.password,function(err,isMatch){
            if(err) console.log("error")
            cb(null, isMatch)
        })
    }
}

UserSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.createAt')
            .exec(cb)
    },
    findById: function (cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}
module.exports = UserSchema
