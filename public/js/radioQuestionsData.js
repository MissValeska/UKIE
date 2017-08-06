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

function findCorrectType() {

  var currentPathname = window.location.pathname;
  console.log(currentPathname);
  var currentModule = currentPathname.split("module/")[1];
  currentModule = currentModule.split("/exercise")[0];
  var currentExercise = currentPathname.split("exercise/")[1];
  currentExercise = currentExercise.split("/questionblock")[0];
  var currentQuestionBlock = currentPathname.split("questionblock/")[1];
  currentQuestionBlock = currentQuestionBlock.split("/question")[0];
  var currentQuestion = currentPathname.split("question/")[1];

  firebase.database().ref('Modules/Module' + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock).once('value').then(function(snapshot) {
    var num = snapshot.val().QuestionNum;
    console.log("Num:" + num);

    if(currentQuestion <= num) {
    firebase.database().ref("Modules/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock).once('value').then(function(snapshot) {
      var type = snapshot.child("Question" + currentQuestion).val().type;
      if(type.includes("radio") == true) {
        console.log("This is a radio question!");
        getRadioQuestionsData();
      }
      else if(type == "dropdown") {
        console.log("This is a dropdown question!");
        getdropdownData();
      }
    });
  }
  else {
    console.log("No more questions left!");
  }
  });

}

function getdropdownData() {

  

}

function getRadioQuestionsData() {

  var currentPathname = window.location.pathname;
  console.log(currentPathname);
  var currentModule = currentPathname.split("module/")[1];
  currentModule = currentModule.split("/exercise")[0];
  var currentExercise = currentPathname.split("exercise/")[1];
  currentExercise = currentExercise.split("/questionblock")[0];
  var currentQuestionBlock = currentPathname.split("questionblock/")[1];
  currentQuestionBlock = currentQuestionBlock.split("/question")[0];
  var currentQuestion = currentPathname.split("question/")[1];

  firebase.database().ref('Modules/Module' + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock).once('value').then(function(snapshot) {
    var num = snapshot.val().QuestionNum;
    console.log("Num:" + num);

      firebase.database().ref("Modules/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock).once('value').then(function(snapshot) {
        //for(var i = 1; i <= num; i++) {
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

        $('#nextBtn').click(function(e){
          e.preventDefault();
          if(document.getElementById('nextBtn').innerHTML == "Next") {
            console.log(currentPathname.slice(0, -1));
            if((parseInt(currentQuestion) + 1) != num) {
              window.location.replace("http://localhost:3000" + currentPathname.slice(0, -1) + (parseInt(currentQuestion) + 1));
            }
            else {
              window.location.replace("http://localhost:3000/success");
            }
          }
          else {
            console.log("submited!");
            var omg = $("input[type=radio]#radio" + correctAnswer ).is(":checked");
            console.log("Omg!" + omg);
            if(omg) {
              console.log("You're correct!");
              document.getElementById('nextBtn').innerHTML = 'Next';
            }
            else {
              console.log("Incorrect, please try again.")
            }
        }
          //saveProfileData(totalData);
          //window.location.replace("http://localhost:3000/results");
        });

        //}
      });
  });


}
