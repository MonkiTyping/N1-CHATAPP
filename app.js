var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var exphbs = require('express-handlebars')
var app = express();
var path = require('path')
var dotenv = require('dotenv')
var dotenv_config = dotenv.config()

//Connect to your database
mongoose.connect('mongodb://localhost/bae',function(err)
{		
    if (err) 
    {
        console.error("MONGODB ERROR \t:",err);
    }
    
});

//Set views folder, Set up view engine == handlebar
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({ defaultLayout: 'layouts'}))
app.set('view engine','handlebars')

app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));			            
app.use(bodyParser.json());

var client = require('./routes/client')
var admin = require('./routes/admin')

app.use('/chat',client)
app.use('/admin',admin)

app.listen(5000, (req,res)=>
{
    console.log("Server listening @ 5000")
});