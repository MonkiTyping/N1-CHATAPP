var mongoose = require('mongoose')

var chatSchema = new mongoose.Schema(
    {
        userId: {type: String,required: true},
        time: {type: Date,default: Date.now},
        message: {type: String,required: true},
        isAdmin: {type: Boolean,default: false}
    })

var chat = mongoose.model('chat',chatSchema)
module.exports = chat