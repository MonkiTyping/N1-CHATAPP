var express = require('express')
var bodyparser = require('body-parser')
var router = express.Router();
var mongoose = require('mongoose')
//var admin = require('firebase-admin')
var send = require('./pusher')
var Handlebars = require('handlebars');

var helper = Handlebars.registerHelper("formatDate", function(datetime,format)
{
    var datetime = datetime.toString().split(' ')
    var month = datetime[1]
    var day = datetime[2]
    var year = datetime[3]
    var time = datetime[4].slice(0,5)
    var timestamp = time+" "+month+"-"+day+"-"+year
    return timestamp
});

const administrator = process.env.ADMIN_ID
const administratorName = process.env.VENDOR_NAME

var helper_admin = Handlebars.registerHelper('excludeAdmin',function(user,options)
{
    //if (user != "ADMIN")
    if (user != administrator)
    {
        return true
    }
    else
    {
        return false
    }
})

var Chats = require('../models/chatModel')
var Users = require('../models/userModel')
var Send = require('../routes/pusher')


router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

router.get('/users',function(req,res)
{
    //Get the list of all users
    Users.find({},function(err,users)
    {
        if (err)
        {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }
        else
        {
            res.status(200)
            res.render('userList',{user_list:users, excludeAdmin: helper_admin})
        }
    })
})

router.post('/register',function(req,res)
{
    //Register ADMIN - Device ID
    //on new registration OR on refresh
    var devId = req.body.devId;

    if (req.body.refresh == "yes")
    {
        Users.updateOne({"user": administrator},{"$set":{"devId":devId}},function(err,chaged)
        {
            if (err) 
            {
                console.error(err)
                return res.status(500).send("Refresh Server Error")
            }
            else
            {
                return res.status(200).send("Updated")
            }
        })
    }
    else
    {
        //Users.findOne({"user": "ADMIN"},function(err,found)
        Users.findOne({"devId": devId},function(err,found)
        {
            if (err)
            {
                console.error(err)
                return res.status(500).send("Internal Server Error")
            }
            if (found)
            {
                //Dev-ID exists
                console.log("Admin registered")
                return res.status(200).send("Registered")
            }
            else
            {
                var admin = new Users
                ({
                    user: administratorName, //Market-Vendor
                    userId: administrator,
                    devId: devId
                })
                admin.save(function(err,safe)
                {
                    if (err) 
                    {
                        console.error(err)
                        return res.status(500).send("Internal Server Error")
                    }
                    else
                    {
                        return res.status(200).send("Finished Registration")
                    }
                })
            }
        })
    }
})
//Send chat message to userId with message
router.post('/messages',function(req,res)
{
    var message = req.body.message
    var userId = req.body.receiver

    if ((message == null) || (userId == null))
    {
        console.error("Undefined Input(s)")
        return res.status(400).send("Bad input")
    }

    var new_chat = new Chats(
    {
        userId: userId,
        message:message,
        isAdmin: true
    })
    new_chat.save(function(err,saved)
    {
        if (err)
        {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }
        else
        {
            var notification = 
            {
                "notification":
                {
                    "tag": "chat_collapsed",
                    "title": administratorName,
                    "body": message,
                    "collapse_key": 'true',
                    "icon" : "../mf.jpg"
                }
            }
            Users.find({"userId": userId},function(err,found)
            {
                if (err)
                {
                    console.error(err)
                    res.status(500).send("Internal Server Error")
                }
                else
                {
                    for(var i = 0;i < found.length; i++)
                    {
                        //Send notificatino to all the devices belonging to userId
                        var devId = found[i].devId
                        Send(devId,notification)
                    }
                    return res.status(200).send("Fine")
                }
            })  
        }
    });
})

router.get('/read_status',function(req,res)
{
    var userId = req.query.userId
    if (userId == null)
    {
        return res.status(400).send("Invalid input")
    }
    console.log(userId)
    Users.findOneAndUpdate({"userId": userId},{"$set":{"read":true}},function(err,updated)
    {
        if (err) 
        {
            console.error("Error updating read status\n",err)
            return res.status(500)
        }
        else
        {
            console.log("Updated")
            res.status(200).send("updated")   
        }
    })
})
router.post('/chat',function(req,res)
{
    //Render the chatbox for the userId
    var userId = req.body.userId;
    
    if (userId == null)
    {
        console.error("Undefined input(s)")
        return res.status(400).send("Bad Input")
    }

    Chats.find({"userId": userId},null,{"sort":{"timestamp":1}},function(err,texts)
    {
        if (err)
        {
            console.error(err)
            return res.status(500).send("Server Error: Could not Chat")
        }
        else
        {
            //res.status(200)
            res.render('adminBox',{userId: userId,texts: texts,admin_chat: true})
        }
    })
})

module.exports = router
