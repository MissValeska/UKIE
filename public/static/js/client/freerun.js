const UKIE_ADDRESS = "http://localhost:3000/";
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBpa4RgteIADz8jvF-OkQLBwqg7a-DjIsY",
  authDomain: "ukie-f3bcd.firebaseapp.com",
  databaseURL: "https://ukie-f3bcd.firebaseio.com",
  projectId: "ukie-f3bcd",
  storageBucket: "ukie-f3bcd.appspot.com",
  messagingSenderId: "723836520365"
};
firebase.initializeApp(config);


function freerun() {

  console.log("Yo!");

  var sentenceUA = "Rawr guys! ^-^";
  var wasClicked = false;

  var correctText = "Something";

  var wordType = "Noun";
  var definition = "A thing";

  document.getElementById("inputLabel1").innerHTML = "Hey guys!";
  document.getElementById("inputLabel2").innerHTML = "Wowza!";

  $('#enBtn').click(function(e){
    e.preventDefault();
    if(wasClicked) {
      wasClicked = false;
      document.getElementById("sentenceUA").innerHTML = "";
    }
    else {
      wasClicked = true;
      document.getElementById("sentenceUA").innerHTML = sentenceUA;
    }
  });

  document.getElementById("wordType").innerHTML = "Word type: " + wordType;
  document.getElementById("definition").innerHTML = "Definition: " + definition;

  $('#peekBtn').click(function(e){
    document.getElementById("inputText").setAttribute("value", correctText);
  });

  $('#nextBtn').click(function(e){
    var omg = $('#inputText').val();
    if(omg == correctText) {
      console.log("You're correct!");
    }
    console.log("omg:" + omg);
  });

}
