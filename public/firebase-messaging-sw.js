// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyA-AcgeRNfZULFzGay3QdNPbUWMzm7XJ8Q",
  authDomain: "trendsgcc.firebaseapp.com",
  projectId: "trendsgcc",
  storageBucket: "trendsgcc.appspot.com",
  messagingSenderId: "823510601412",
  appId: "1:823510601412:web:66b3af5ac53961d0be4391",
  measurementId: "G-NH4F6DS4D5",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
