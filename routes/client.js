var express = require('express')
var bodyParser = require('body-parser')

var mongoose = require('mongoose')
var router = express.Router();
var path = require('path')

var Users = require('../models/userModel')
var Chats = require('../models/chatModel')
var Send = require('../routes/pusher')

router.use(bodyParser.urlencoded({ extended: true }));			            
router.use(bodyParser.json());

//Let us send client-messages from here to chat.
//Here, A client types in a chat message. (with a unique order)
//Sends to server which pushes
//to the admin

/*
  Allow user to choose a username so that he can start chatting
*/
router.get('/intro', (req,res)=>
{
    res.sendfile('./views/html/greetings.html')
});

//Get ALL the messages of the chat of userID
router.post('/message',(req,res)=>
{
    var userId = req.body.userId
    
    if (userId == null)
    {
        console.log("Invalid input")
        return res.status(400).send("Bad input")
    }
    //Find all the chats and sort it by most recent
    Chats.find({"userId": userId},null,{sort:{"timestamp":1}},function(err,messages)
    {
        if (err)
        {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }
        else
        {
            var context = 
            {
                userId: userId,
                messages: messages,
                client_chat: true
            }
            //Render the chatbox in a HTML page with the above contextual parameters
            res.render('chatBox',context)
        }
    });
});

//Check if a user-name has been used or not
router.post('/usernames',function(req,res)
{
    var userId = req.body.userId
    if (userId == null)
    {
        console.log("Invalid input")
        return res.status(400).send("Bad input")
    }
    Users.findOne({"userId": userId},function(err,found)
    {
        if (err)
        {
            console.error(err)
            res.status(500).send("Internal Server Error")
        }
        else if (found)
        {
            //If found the user, return exists
            res.status(203).send("exists")
        }
        else
        {
            //else return new
            res.status(200).send("new")
        }
    });
});

/*
  REGISTER the user and his unique device for chat if they are not already registered
*/
router.post('/register',(req,res)=>
{
    //Upsert Token
    //If token exists for userId, UP(date) it
    //else in(SERT) token for userId
    var userId = req.body.userId;
    var devId = req.body.devId;

    if ((userId == null)||(devId == null))
    {
        console.error("User-Device registration missing data.")
        return res.status(400).send("Missing data")
    }
    else
    {
        Users.findOne({"devId":devId},function(err,found)
        {
            if (err)
            {
                console.error(err)
                return res.status(500).send("Internal Server Error")
            }
            //If device ID is already registered, Don't perform any action
            //Remove this for testing
            //Since I am using a single system, All the device-IDs are registered to this system
            else if (found)
            {
                console.log("User-Device exists")
                return res.status(204).send("Device exists")
            }
            else
            {
                var new_user = new Users(
                {
                    "userId": userId,
                    "devId": devId
                })
                new_user.save(function(err,safe)
                {
                    if (err) console.error(err)
                })
                return res.status(200).send("success")
            }
        })
    }
})


//Send the ADMIN a message from the user's unique ID with message
router.post('/messages',function(req,res)
{
    var unique_id = req.body.id
    var message = req.body.message

    if ((unique_id == null ) || (message == null))
    {
        console.error("Invalid input")
        return res.status(400).send("Bad input")
    }

    var new_chat = new Chats(
    {
        userId: unique_id,
        message: message
    })

    //define notification
    var title = "Message for Vendor"
    var notification = 
    {
        "notification":
        {
            "tag": "chat_collapsed",
            "title": title,
            "body": message,
            "collapse_key": 'true',
            "icon" : "../mf.jpg"
        }
    }
    //No necessity for data_notification yet

    new_chat.save(function(err,saved)
    {
        if (err)
        {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }
        else
        {
            //May have to be find
            Users.findOne({"userId": "ADMIN"},function(err,found)
            { //users=ADMIN can be  > 1
                if (err)
                {
                    console.error(err)
                    return res.status(500).send("Internal Server Error")
                }
                else if (!found)
                {
                    console.error("\n\n NO ADMIN TO SEND MESSAGES TO")
                    return res.status(500).send("Missing admin")
                }
                else
                {
                    var devId = found.devId
                    Send(devId,notification)
                }
            })
            Users.findOneAndUpdate({"userId": unique_id},{"$set":{"read":false}},function(err,updated)
            {
                if (err) 
                {
                    console.error("Error updating read status\n",err)
                    return res.status(500)
                }
                else
                {
                    res.status(200).send("sent")
                    
                }
            })
        }
    });

});

module.exports = router