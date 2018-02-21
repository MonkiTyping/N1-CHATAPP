var admin = require('firebase-admin')
var serviceAccount = require('../key/serviceAccountKey.json')
var make = require('../routes/fb_client')
var send_notification = make.send_notification 

//Connect to firebase
var app = admin.initializeApp(
{
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatapp4nis21.firebaseio.com"
});



//Can also add optional parameters to choose whether to send notification
//data = 1, notification = 1
//Sends message=payload to device = to
function send(to,payload)
{
    if ((!to) || (!payload))
    {
        console.error("Missing data. Message will NOT be delivered")
        return -1
    }
    else
    {
        
        admin.messaging().sendToDevice(to,payload)
            .then(function(response)
            {
                console.log("FB-SDK sent message")
                return response
            })
            .catch(function(err)
            {
                console.error("ERROR @ FB-SDK \n",err)
                return -1
            });
    }
}


module.exports = send