function getData() {

var config = {
  apiKey: "AIzaSyBpa4RgteIADz8jvF-OkQLBwqg7a-DjIsY",
  authDomain: "ukie-f3bcd.firebaseapp.com",
  databaseURL: "https://ukie-f3bcd.firebaseio.com",
  projectId: "ukie-f3bcd",
  storageBucket: "ukie-f3bcd.appspot.com",
  messagingSenderId: "723836520365"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

return firebase.database().ref('Modules').once('value').then(function(snapshot) {
  var username = snapshot.val().ModuleNum;
  console.log(username);
  // ...
});

}
