function make_notification(payload)
{
    var title = "Message from VENDOR_NAME"
    var body = payload
    var notification = 
    {
        "notification": 
        {
            "title": title,
            "body": payload
        }
    }
    return notification
}

function make_data(payload)
{
    //Currently no need for any data messages

}



module.exports = 
{
    make_notification,make_data
}