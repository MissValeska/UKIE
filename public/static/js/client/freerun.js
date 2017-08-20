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

function stuff(snapshot, num) {

  var rnd = Math.floor(Math.random() * num) + 1;

  console.log("Stuff!" + rnd);

  var sentenceEN = snapshot.child("question" + rnd).val().sentenceEN;
  var wasClicked = false;
  var wasClicked1 = false;

  var correctText = snapshot.child("question" + rnd).val().word;

  var splitted = snapshot.child("question" + rnd).val().sentenceUA.split("+");

  var label1 = splitted[0];
  var label2 = "";
  if(splitted.length == 2) {
    label2 = splitted[1];
  }

  var wordType = snapshot.child("question" + rnd).val().type;
  var definition = snapshot.child("question" + rnd).val().definition;

  document.getElementById("inputLabel1").innerHTML = label1;
  document.getElementById("inputLabel2").innerHTML = label2;

  $('#enBtn').click(function(e){
    e.preventDefault();
    if(wasClicked) {
      wasClicked = false;
      document.getElementById("sentenceEN").innerHTML = "";
    }
    else {
      wasClicked = true;
      document.getElementById("sentenceEN").innerHTML = sentenceEN;
    }
  });

  document.getElementById("wordType").innerHTML = "Word type: " + wordType;
  document.getElementById("definition").innerHTML = "Definition: " + definition;

  $('#peekBtn').click(function(e){
    if(wasClicked1) {
      wasClicked1 = false;
      document.getElementById("inputText").placeholder = "";
    }
    else {
      wasClicked1 = true;
      document.getElementById("inputText").value = "";
      document.getElementById("inputText").setAttribute("placeholder", correctText);
    }
  });

  $('#nextBtn').click(function(e){
    var omg = $('#inputText').val();
    console.log("omg:" + omg);
    if(document.getElementById('nextBtn').innerHTML == "Next") {
      document.getElementById("inputText").value = "";
      document.getElementById("inputText").placeholder = "";
      document.getElementById('nextBtn').innerHTML = "Check"
      stuff(snapshot, num);
    }
    if(omg.toLowerCase() == correctText.toLowerCase()) {
      console.log("You're correct!");
      document.getElementById('nextBtn').innerHTML = "Next"
    }
    else {
      console.log("That's incorrect");
    }
  });

}

function freerun() {

  console.log("Yo!");

  firebase.database().ref('freerun').once('value').then(function(snapshot) {
    num = snapshot.val().num;
    console.log("Num:" + num);

    stuff(snapshot, num);

  });

}
