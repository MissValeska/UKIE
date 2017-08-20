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

var userData;

// !! What is grammarType?
function addGrammarData(correctCount, incorrectCount, grammar, grammarType) {

  var currentdate = new Date();
  var datetime = currentdate.getDate() + " "
              + (currentdate.getMonth()+1)  + " "
              + currentdate.getFullYear() + ","
              + currentdate.getHours() + ":"
              + currentdate.getMinutes() + ":"
              + currentdate.getSeconds();

  firebase.database().ref('users/' + userData.uid + "/GrammarData/GrammarData:" + grammar.toLowerCase()).once('value').then(function(snapshot) {

        var grammarData = snapshot.val();
        var tmp = grammarData.split(":");
        var correct = tmp[0];
        var incorrect = tmp[1];
        var storedGrammar = tmp[2];
        /*var date;
        if(tmp.length == 4) {
          date = tmp[3];
        }
        else if(tmp.length == 5) {
          date = tmp[3];
          date += tmp[4];
        }*/

        var obj = {GrammarData: (correct + correctCount) + ":" + (incorrect + incorrectCount) + ":" + grammar.toLowerCase() + ":" + datetime};

        Object.defineProperty(obj, "GrammarData:" + grammar.toLowerCase(), Object.getOwnPropertyDescriptor(obj, "GrammarData"));

        firebase.database().ref('users/' + userData.uid + "/GrammarData").update(obj);

  });
}

function addWordData(correctCount, incorrectCount, word) {

  var currentdate = new Date();
  var datetime = currentdate.getDate() + " "
              + (currentdate.getMonth()+1)  + " "
              + currentdate.getFullYear() + ","
              + currentdate.getHours() + ":"
              + currentdate.getMinutes() + ":"
              + currentdate.getSeconds();

  firebase.database().ref('users/' + userData.uid + "/WordData/WordData:" + word.toLowerCase()).once('value').then(function(snapshot) {

        var wordData = snapshot.val();
        var tmp = wordData.split(":");
        var correct = tmp[0];
        var incorrect = tmp[1];
        var storedWord = tmp[2];
        /*var date;
        if(tmp.length == 4) {
          date = tmp[3];
        }
        else if(tmp.length == 5) {
          date = tmp[3];
          date += tmp[4];
        }*/

        var obj = {WordData: (correct + correctCount) + ":" + (incorrect + incorrectCount) + ":" + word.toLowerCase() + ":" + datetime};

        Object.defineProperty(obj, "WordData:" + word.toLowerCase(), Object.getOwnPropertyDescriptor(obj, "WordData"));

        firebase.database().ref('users/' + userData.uid + "/WordData").update(obj);

  });
}

function addCorrect(currentQuestion) {

  var correctCount = 0;

  firebase.database().ref('users/' + userData.uid + "/Statistics/Freerun/Question" + currentQuestion).once('value').then(function(snapshot) {
    try {
      correctCount = snapshot.val().correct;
      console.log("CorrectCount:" + correctCount);
    }
    catch(err) {
      console.log(err.message);
    }

    firebase.database().ref('users/' + userData.uid + "/Statistics/Freerun/Question" + currentQuestion).update({
      correct: correctCount + 1
    });
});

}

function addIncorrect(currentQuestion) {

  var incorrectCount = 0;

  firebase.database().ref('users/' + userData.uid + "/Statistics/Freerun/Question" + currentQuestion).once('value').then(function(snapshot) {
    try {
      incorrectCount = snapshot.val().incorrect;
      console.log("IncorrectCount:" + incorrectCount);
    }
    catch(err) {
      console.log(err.message);
    }

    firebase.database().ref('users/' + userData.uid + "/Statistics/Freerun/Question" + currentQuestion).update({
      incorrect: incorrectCount + 1
    });
});

}

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

  var isWord = false;
  var word;
  var isGrammar = false;
  var grammar;
  var grammarType;

  try {
    isWord = snapshot.child("question" + rnd).val().isWord;
    word = snapshot.child("question" + rnd).val().word;
  }
  catch(err) {
    console.log(err.message);
  }
  try {
    isGrammar = snapshot.child("question" + rnd).val().isGrammar;
    grammar = snapshot.child("question" + rnd).val().grammar;
    grammarType = snapshot.child("question" + rnd).val().grammarType;
  }
  catch(err) {
    console.log(err.message);
  }

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
      addCorrect(rnd);
      if(isWord) {
        addWordData(1, 0, word);
      }
      if(isGrammar) {
        addGrammarData(1, 0, grammar, grammarType);
      }
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
      addIncorrect(rnd);
      if(isWord) {
        addWordData(0, 1, word);
      }
      if(isGrammar) {
        addGrammarData(0, 1, grammar, grammarType);
      }
    }
  });

}

function freerun() {

  console.log("Yo!");

  firebase.database().ref('freerun').once('value').then(function(snapshot) {
    num = snapshot.val().num;
    console.log("Num:" + num);

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("Username:" + user.displayName);
        userData = user;

        stuff(snapshot, num);

      } else {
        console.log("not signed in!")
        // No user is signed in.
      }
    });

  });

}
