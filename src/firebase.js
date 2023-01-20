import firebase from "firebase";
import 'firebase/messaging';
    
const firebaseConfig = {
  apiKey: "AIzaSyA-AcgeRNfZULFzGay3QdNPbUWMzm7XJ8Q",
  authDomain: "trendsgcc.firebaseapp.com",
  projectId: "trendsgcc",
  storageBucket: "trendsgcc.appspot.com",
  messagingSenderId: "823510601412",
  appId: "1:823510601412:web:66b3af5ac53961d0be4391",
  measurementId: "G-NH4F6DS4D5",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      console.log(payload);
      resolve(payload);
    });
  });

export const getToken = () => {
  return messaging
    .getToken({
      vapidKey:
        "BLGIz_j2ZRbQo9qdauBcaGlVOdg4cE3bh0tli-QgZmxVM0jBt9CGNzWk7XyOq3hCAynQ4sg-NpPC6YlRdKdaWoc",
    })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        return currentToken;
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        return undefined;
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};
