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

function addCorrect() {

  var correctCount = 0;

  firebase.database().ref('users/' + userData.uid + "/Statistics/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock + "/Question" + currentQuestion).once('value').then(function(snapshot) {
    try {
      correctCount = snapshot.val().correct;
      console.log("CorrectCount:" + correctCount);
    }
    catch(err) {
      console.log(err.message);
    }

    firebase.database().ref('users/' + userData.uid + "/Statistics/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock + "/Question" + currentQuestion).update({
      correct: correctCount + 1
    });
});

}

function addIncorrect() {

  var incorrectCount = 0;

  firebase.database().ref('users/' + userData.uid + "/Statistics/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock + "/Question" + currentQuestion).once('value').then(function(snapshot) {
    try {
      incorrectCount = snapshot.val().incorrect;
      console.log("IncorrectCount:" + incorrectCount);
    }
    catch(err) {
      console.log(err.message);
    }

    firebase.database().ref('users/' + userData.uid + "/Statistics/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock + "/Question" + currentQuestion).update({
      incorrect: incorrectCount + 1
    });
});

}

const RADIO = 0;
const DROPDOWN = 1;

function submitBtnClicked(correctText, correctAnswer, i) {

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
      }
      else {
        console.log("Incorrect, please try again.");
        addIncorrect();
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

  submitBtnClicked(correctText, correctAnswer, DROPDOWN);

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
          var isWord = snapshot.child("Question" + i).val().isWord;

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

        submitBtnClicked(correctText, correctAnswer, RADIO);


}
