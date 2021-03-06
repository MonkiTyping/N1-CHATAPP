
### What is this repository ? ###

* Chat-application using Node.js(backend) and for the front end, Javascript,Jquery,CSS and Handlebars to render HTMl.

* The application allows mulitple clients to register and start chatting with a single recipient ie N:1 chats. The messages are  sent in real time with notifications appearing while using the application and a customizable banner when the user is on the browser but off the app.
 
* Real time notifications are part of cloud messaging functions which are services provided by Google's Firebase, Which allows an Admin to send notifications by sending the userId and the message content that he/she has to be notified with to the firebase servers which will push the notification instantly.

### How do I get set up? ###

* Install node
* Install dependencied by typing *npm install*
* Database is configured to run on localhost
* Run the app using *node app.js*

You will need to add the code and integrate it into your application depending on your intention. 
This app uses the user's unique userId to sign the messages between the party and the recipient. You can use any such unique IDs to sign the chat messages.

* To use the application for your own needs, use your gmail account and create a new project under the firebase console. 
* A public pair of keys are generated for use on the HTML pages where the chatboxes exist.
* The private pair of keys are stored under /key/serviceAccountKey.json and are used by /routes/pusher.js. (Essentially these keys are read by firebase-admin and are used to push the messages to the server)

Firebase runs ONLY on SECURE hosts which means it will run on your localhost OR on a secure site which is HTTPS. 

IMPORTANT: Each client that uses firebase has a device ID unique to the system. You can NOT test the app correctly on localhost without making
a few changes to the logic OR by replicating requests using cURL or POSTMan

The application consists of 

* A page for the user to register and send messages to the admin and receive messages from admin

* A page for admin to view all user and whether anyone sent him a message

* A page for admin to reply to the messages posted by sender. 
