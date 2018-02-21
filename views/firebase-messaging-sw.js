importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
var config = 
{
	apiKey: "AIzaSyCkYQpBbWHJFaoIQvYFFuU0ZNXH4cG3B7o",
	authDomain: "chatapp4nis21.firebaseapp.com",
	databaseURL: "https://chatapp4nis21.firebaseio.com",
	projectId: "chatapp4nis21",
	storageBucket: "chatapp4nis21.appspot.com",
	messagingSenderId: "620228335142"
};

firebase.initializeApp(config);		
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload)
{

	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	
	var notificationTitle = 'New message!';
	var notificationOptions = 
	{
		body: "Someone is telling you that you suck"
	};

	return self.registration.showNotification(notificationTitle, notificationOptions);
});

