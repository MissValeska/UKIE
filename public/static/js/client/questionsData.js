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

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("Username:" + user.displayName);
    userData = user;
  } else {
    console.log("not signed in!")
    //login();
    // No user is signed in.
  }
});

var currentPathname;
var currentModule;
var currentExercise;
var currentQuestionBlock;
var currentQuestion;
var num;

function findCorrectType() {

  currentPathname = window.location.pathname;
  console.log(currentPathname);
  currentModule = currentPathname.split("module/")[1];
  currentModule = currentModule.split("/exercise")[0];
  currentExercise = currentPathname.split("exercise/")[1];
  currentExercise = currentExercise.split("/questionblock")[0];
  currentQuestionBlock = currentPathname.split("questionblock/")[1];
  currentQuestionBlock = currentQuestionBlock.split("/question")[0];
  currentQuestion = currentPathname.split("question/")[1];

  firebase.database().ref('Modules/Module' + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock).once('value').then(function(snapshot) {
    num = snapshot.val().QuestionNum;
    console.log("Num:" + num);

    if(currentQuestion <= num) {
    firebase.database().ref("Modules/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock).once('value').then(function(snapshot) {
      var type = snapshot.child("Question" + currentQuestion).val().type;
      if(type.includes("radio") == true) {
        console.log("This is a radio question!");
        getRadioQuestionsData(num, snapshot);
      }
      else if(type == "dropdown") {
        console.log("This is a dropdown question!");
        getdropdownData(num, snapshot);
      }
    });
  }
  else {
    console.log("No more questions left!");
  }
  });

}

const QUESTION = 0;
const QUESTIONBLOCK = 1;
const EXERCISE = 2;
const MODULE = 3;

function markAsCompleted(i) {

  if(i == QUESTION) {
    firebase.database().ref('users/' + userData.uid + "/Module" + currentModule + "Exercise" + currentExercise + "QuestionBlock" + currentQuestionBlock + "Question" + currentQuestion + "CompletedQuestion").set(true);
  }

  if(i == QUESTIONBLOCK) {
    firebase.database().ref('users/' + userData.uid + "/Module" + currentModule + "Exercise" + currentExercise + "QuestionBlock" + currentQuestionBlock + "CompletedQuestionBlock").set(true);
  }

  if(i == EXERCISE) {
    firebase.database().ref('users/' + userData.uid + "/Module" + currentModule + "Exercise" + currentExercise + "CompletedExercise").set(true);
  }

  if(i == MODULE) {
    firebase.database().ref('users/' + userData.uid + "/Module" + currentModule + "CompletedModule").set(true);
  }

}

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

function addCorrect() {

  var correctCount = 0;
  var TotalCorrectCount = 0;

  firebase.database().ref('users/' + userData.uid + "/Statistics").once('value').then(function(snapshot) {
    try {
      correctCount = snapshot.child("Modules/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock + "/Question" + currentQuestion).val().correct;
      console.log("CorrectCount:" + correctCount);
    }
    catch(err) {
      console.log(err.message);
      correctCount = 0;
    }

    try {
      TotalCorrectCount = snapshot.val().TotalCorrect;
      console.log("TotalCorrectCount:" + TotalCorrectCount);
    }
    catch(err) {
      console.log(err.message);
      TotalCorrectCount = 0;
    }

    if(correctCount == Math.NaN) {
      correctCount = 0;
    }

    if(TotalCorrectCount == Math.NaN) {
      TotalCorrectCount = 0;
    }

    console.log("hey!" + (correctCount + 1));
    console.log("woah!" + (TotalCorrectCount + 1));

    try {
      firebase.database().ref('users/' + userData.uid + "/Statistics/Modules/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock + "/Question" + currentQuestion).update({
        correct: correctCount + 1
      });
    }
    catch(err) {
      console.log(err.message);
    }

    try {
      firebase.database().ref('users/' + userData.uid + "/Statistics").update({
        TotalCorrect: TotalCorrectCount + 1
      });
    }
    catch(err) {
      console.log(err.message);
    }
});

}

function addIncorrect() {

  var incorrectCount = 0;
  var TotalIncorrectCount = 0;

  firebase.database().ref('users/' + userData.uid + "/Statistics").once('value').then(function(snapshot) {
    try {
      incorrectCount = snapshot.child("Modules/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock + "/Question" + currentQuestion).val().incorrect;
      console.log("IncorrectCount:" + incorrectCount);
    }
    catch(err) {
      console.log(err.message);
      incorrectCount = 0;
    }

    try {
      TotalIncorrectCount = snapshot.val().TotalIncorrect;
      console.log("TotalIncorrectCount:" + TotalIncorrectCount);
    }
    catch(err) {
      console.log(err.message);
      TotalIncorrectCount = 0;
    }

    if(incorrectCount == Math.NaN) {
      incorrectCount = 0;
    }

    if(TotalIncorrectCount == Math.NaN) {
      TotalIncorrectCount = 0;
    }

    console.log("hey!" + (incorrectCount + 1));
    console.log("woah!" + (TotalIncorrectCount + 1));

    try {
      firebase.database().ref('users/' + userData.uid + "/Statistics/Modules/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock + "/Question" + currentQuestion).update({
        incorrect: incorrectCount + 1
      });
    }
    catch(err) {
      console.log(err.message);
    }

    try {
      firebase.database().ref('users/' + userData.uid + "/Statistics").update({
        TotalIncorrect: TotalIncorrectCount + 1
      });
    }
    catch(err) {
      console.log(err.message);
    }
});

}

const RADIO = 0;
const DROPDOWN = 1;

function submitBtnClicked(correctText, correctAnswer, i, isWord, isGrammar, word, grammar, grammarType) {

  $('#nextBtn').click(function(e){
    e.preventDefault();
    if(document.getElementById('nextBtn').innerHTML == "Next") {
      markAsCompleted(0);
      console.log(currentPathname.slice(0, -1));
      if((parseInt(currentQuestion) + 1) != num) {
        window.location.replace("http://localhost:3000" + currentPathname.slice(0, -1) + (parseInt(currentQuestion) + 1));
      }
      else {
        markAsCompleted(1);
        // Check if this is the end of an exericse and or module as well, and record that
        window.location.replace("http://localhost:3000/success");
      }
    }
    else {
      console.log("submited!");
      var omg;
      if(i == RADIO) {
        omg = $("input[type=radio]#radio" + correctAnswer).is(":checked");
      }
      else if(i == DROPDOWN) {
        omg = $('#dropdown').find(":selected").text();
      }
      console.log("Omg!" + omg);
      var tmp;
      if(i == RADIO) {
        tmp = omg;
      }
      else if(i == DROPDOWN) {
        if(omg == correctText) {
          tmp = true;
        }
        else {
          tmp = false;
        }
      }
      if(tmp) {
        console.log("You're correct!");
        document.getElementById('nextBtn').innerHTML = 'Next';
        addCorrect();
        if(isWord) {
          addWordData(1, 0, word);
        }
        if(isGrammar) {
          addGrammarData(1, 0, grammar, grammarType);
        }
      }
      else {
        console.log("Incorrect, please try again.");
        addIncorrect();
        if(isWord) {
          addWordData(0, 1, word);
        }
        if(isGrammar) {
          addGrammarData(0, 1, grammar, grammarType);
        }
      }
  }
    //saveProfileData(totalData);
    //window.location.replace("http://localhost:3000/results");
  });

}

function getdropdownData(num, snapshot) {

  var i = currentQuestion;
  var correctAnswer = snapshot.child("Question" + i).val().correctAnswer;
  var questionText = snapshot.child("Question" + i).val().questionText;
  var dropDown1 = snapshot.child("Question" + i).val().dropDown1;
  var dropDown2 = snapshot.child("Question" + i).val().dropDown2;
  var questionText1 = snapshot.child("Question" + i).val().questionText1;
  var type = snapshot.child("Question" + i).val().type;

  var isWord = false;
  var word;
  var isGrammar = false;
  var grammar;
  var grammarType;

  try {
    isWord = snapshot.child("Question" + i).val().isWord;
    word = snapshot.child("Question" + i).val().word;
  }
  catch(err) {
    console.log(err.message);
  }
  try {
    isGrammar = snapshot.child("Question" + i).val().isGrammar;
    grammar = snapshot.child("Question" + i).val().grammar;
    grammarType = snapshot.child("Question" + i).val().grammarType;
  }
  catch(err) {
    console.log(err.message);
  }
  /*var radioAudio = snapshot.child("Question" + i).val().radioAudio;
  var letter = snapshot.child("Question" + i).val().letter;
  var isWord = snapshot.child("Question" + i).val().isWord;*/

  if(type.includes("radio") == false) {
    console.log("Not a radio question!");
  }

  var arrayText = [dropDown1, dropDown2];
  var correctText = arrayText[correctAnswer-1];

  //var node = document.createElement("div");              // Create a <li> node
  //var imgnode = document.createElement("img");
  //var formnode = document.createElement("form");
  //var audionode = document.createElement("audio");

  var h1node = document.createElement("h1");

  var pnode = document.createElement("p");

  var submitbtn = document.createElement("button");
  submitbtn.setAttribute("type", "button");
  submitbtn.setAttribute("id", "nextBtn");
  submitbtn.innerHTML = "Check";

  var dropDown = document.createElement("select");
  dropDown.setAttribute("id", "dropdown");

  var option1 = document.createElement("option");
  var option2 = document.createElement("option");

  option1.setAttribute("value", dropDown1);
  option1.setAttribute("id", "dropdown1");
  option1.innerHTML = dropDown1;

  option2.setAttribute("value", dropDown2);
  option2.setAttribute("id", "dropdown2");
  option2.innerHTML = dropDown2;

  dropDown.appendChild(option1);
  dropDown.appendChild(option2);

  /*var label1 = document.createElement("label");
  label1.setAttribute("class", "block");
  label1.innerHTML = radioText1;
  var label2 = document.createElement("label");
  label2.setAttribute("class", "block");
  label2.innerHTML = radioText2;
  var label3 = document.createElement("label");
  label3.setAttribute("class", "block");
  label3.innerHTML = radioText3;
  var label4 = document.createElement("label");
  label4.setAttribute("class", "block");
  label4.innerHTML = radioText4;

  var radionode1 = document.createElement("input");
  radionode1.setAttribute("type", "radio");    
  radionode1.setAttribute("name", "qStuff");
  radionode1.setAttribute("id", "radio1");  
  radionode1.setAttribute("value", radioText1);
  var radionode2 = document.createElement("input");
  radionode2.setAttribute("type", "radio");    
  radionode2.setAttribute("name", "qStuff");
  radionode2.setAttribute("id", "radio2");  
  radionode2.setAttribute("value", radioText2);
  var radionode3 = document.createElement("input");  
  radionode3.setAttribute("type", "radio");  
  radionode3.setAttribute("name", "qStuff");
  radionode3.setAttribute("id", "radio3");  
  radionode3.setAttribute("value", radioText3);
  var radionode4 = document.createElement("input");
  radionode4.setAttribute("type", "radio");     
  radionode4.setAttribute("name", "qStuff");
  radionode4.setAttribute("id", "radio4");  
  radionode4.setAttribute("value", radioText4);

  formnode.setAttribute("action", "");
  formnode.setAttribute("id", "radioForm");
  label1.appendChild(radionode1);
  label2.appendChild(radionode2);
  label3.appendChild(radionode3);
  label4.appendChild(radionode4);
  formnode.appendChild(label1);
  formnode.appendChild(label2);
  formnode.appendChild(label3);
  formnode.appendChild(label4);

  audionode.setAttribute("src", radioAudio);
  audionode.setAttribute("type", "audio/mpeg");
  audionode.setAttribute("controls", "controls");*/

  h1node.innerHTML = questionText;
  pnode.innerHTML = questionText1;

  //imgnode.setAttribute("src", url);
  //node.appendChild(imgnode);                        // Append the text to <li>
  //node.appendChild(formnode);
  //node.id = "Question" + i;
  document.getElementById("dataDiv").appendChild(h1node);
  document.getElementById("dataDiv").appendChild(pnode);
  document.getElementById("dataDiv").appendChild(dropDown);
  //document.getElementById("dataDiv").appendChild(audionode);
  //document.getElementById("dataDiv").appendChild(formnode);     // Append <li> to <ul> with id="dataStore"
  document.getElementById("dataDiv").appendChild(submitbtn);
  // ...

  submitBtnClicked(correctText, correctAnswer, DROPDOWN, isWord, isGrammar, word, grammar, grammarType);

}

function getRadioQuestionsData(num, snapshot) {

          var i = currentQuestion;
          var correctAnswer = snapshot.child("Question" + i).val().correctAnswer;
          var questionText = snapshot.child("Question" + i).val().questionText;
          var radioText1 = snapshot.child("Question" + i).val().radioText1;
          var radioText2 = snapshot.child("Question" + i).val().radioText2;
          var radioText3 = snapshot.child("Question" + i).val().radioText3;
          var radioText4 = snapshot.child("Question" + i).val().radioText4;
          var type = snapshot.child("Question" + i).val().type;
          var radioAudio = snapshot.child("Question" + i).val().radioAudio;
          var letter = snapshot.child("Question" + i).val().letter;
          //var isWord = snapshot.child("Question" + i).val().isWord;

          var isWord = false;
          var word;
          var isGrammar = false;
          var grammar;
          var grammarType;

          try {
            isWord = snapshot.child("Question" + i).val().isWord;
            word = snapshot.child("Question" + i).val().word;
          }
          catch(err) {
            console.log(err.message);
          }
          try {
            isGrammar = snapshot.child("Question" + i).val().isGrammar;
            grammar = snapshot.child("Question" + i).val().grammar;
            grammarType = snapshot.child("Question" + i).val().grammarType;
          }
          catch(err) {
            console.log(err.message);
          }

          if(type.includes("radio") == false) {
            console.log("Not a radio question!");
          }

          var arrayText = [radioText1, radioText2, radioText3, radioText4];
          var correctText = arrayText[correctAnswer-1];

          //var node = document.createElement("div");              // Create a <li> node
          var imgnode = document.createElement("img");
          var formnode = document.createElement("form");
          var audionode = document.createElement("audio");

          var h1node = document.createElement("h1");

          var submitbtn = document.createElement("button");
          submitbtn.setAttribute("type", "button");
          submitbtn.setAttribute("id", "nextBtn");
          submitbtn.innerHTML = "Check";

          var label1 = document.createElement("label");
          label1.setAttribute("class", "block");
          label1.innerHTML = radioText1;
          var label2 = document.createElement("label");
          label2.setAttribute("class", "block");
          label2.innerHTML = radioText2;
          var label3 = document.createElement("label");
          label3.setAttribute("class", "block");
          label3.innerHTML = radioText3;
          var label4 = document.createElement("label");
          label4.setAttribute("class", "block");
          label4.innerHTML = radioText4;

          var radionode1 = document.createElement("input");
          radionode1.setAttribute("type", "radio");    
          radionode1.setAttribute("name", "qStuff");
          radionode1.setAttribute("id", "radio1");  
          radionode1.setAttribute("value", radioText1);
          var radionode2 = document.createElement("input");
          radionode2.setAttribute("type", "radio");    
          radionode2.setAttribute("name", "qStuff");
          radionode2.setAttribute("id", "radio2");  
          radionode2.setAttribute("value", radioText2);
          var radionode3 = document.createElement("input");  
          radionode3.setAttribute("type", "radio");  
          radionode3.setAttribute("name", "qStuff");
          radionode3.setAttribute("id", "radio3");  
          radionode3.setAttribute("value", radioText3);
          var radionode4 = document.createElement("input");
          radionode4.setAttribute("type", "radio");     
          radionode4.setAttribute("name", "qStuff");
          radionode4.setAttribute("id", "radio4");  
          radionode4.setAttribute("value", radioText4);

          formnode.setAttribute("action", "");
          formnode.setAttribute("id", "radioForm");
          label1.appendChild(radionode1);
          label2.appendChild(radionode2);
          label3.appendChild(radionode3);
          label4.appendChild(radionode4);
          formnode.appendChild(label1);
          formnode.appendChild(label2);
          formnode.appendChild(label3);
          formnode.appendChild(label4);

          audionode.setAttribute("src", radioAudio);
          audionode.setAttribute("type", "audio/mpeg");
          audionode.setAttribute("controls", "controls");

          h1node.innerHTML = questionText;

          //imgnode.setAttribute("src", url);
          //node.appendChild(imgnode);                        // Append the text to <li>
          //node.appendChild(formnode);
          //node.id = "Question" + i;
          document.getElementById("dataDiv").appendChild(h1node);
          document.getElementById("dataDiv").appendChild(audionode);
          document.getElementById("dataDiv").appendChild(formnode);     // Append <li> to <ul> with id="dataStore"
          document.getElementById("dataDiv").appendChild(submitbtn);
          // ...

        submitBtnClicked(correctText, correctAnswer, RADIO, isWord, isGrammar, word, grammar, grammarType);


}
