var mongoose = require('mongoose')

var userSchema = new mongoose.Schema(
    {
        user: {type: String},
        userId: {type: String,required: true},
        devId: {type: String,required: true},
        read : {type: Boolean, default: true}
    });

var users = mongoose.model('users',userSchema)

module.exports = users