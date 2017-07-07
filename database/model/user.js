var mongoose = require('mongoose')
var userSchema = require('../schema/user')

var User = mongoose.model('user',userSchema)

module.exports = User