function getRadioQuestionsData() {

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

  var currentPathname = window.location.pathname;
  var currentModule = currentPathname.split("module/")[1];
  currentModule = currentModule.split("/exercise")[0];
  var currentExercise = currentPathname.split("exercise/")[1];
  currentExercise = currentPathname.split("/questionblock")[0];
  var currentQuestionBlock = currentPathname.split("questionblock/")[1];

  firebase.database().ref('Modules/Module' + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock).once('value').then(function(snapshot) {
    var num = snapshot.val().QuestionNum;

      firebase.database().ref("Modules/Module" + currentModule + "/Exercise" + currentExercise + "/QuestionBlock" + currentQuestionBlock).once('value').then(function(snapshot) {
        //for(var i = 1; i <= num; i++) {
          console.log("In!")
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

          var node = document.createElement("li");              // Create a <li> node
          var imgnode = document.createElement("img");
          var formnode = document.createElement("form");
           
          var radionode1 = document.createElement("radio");   
          radionode1.setAttribute("name", "qStuff");  
          radionode1.setAttribute("value", radioText1);
          var radionode2 = document.createElement("radio");   
          radionode2.setAttribute("name", "qStuff");  
          radionode2.setAttribute("value", radioText2);
          var radionode3 = document.createElement("radio");   
          radionode3.setAttribute("name", "qStuff");  
          radionode3.setAttribute("value", radioText3);
          var radionode4 = document.createElement("radio");   
          radionode4.setAttribute("name", "qStuff");  
          radionode4.setAttribute("value", radioText4);

          formnode.setAttribute("action", "");
          formnode.setAttribute("id", "radioForm");
          formnode.appendChild(radionode1);
          formnode.appendChild(radionode2);
          formnode.appendChild(radionode3);
          formnode.appendChild(radionode4);
                      
          imgnode.setAttribute("src", url);
          node.appendChild(linknode);                        // Append the text to <li>
          node.id = "Question" + i;
          document.getElementById("dataStore").appendChild(node);     // Append <li> to <ul> with id="dataStore"
          // ...

        $('#radioForm').submit(function(e){
          e.preventDefault();
          console.log("submited!");
          var radioText = $("#radioForm").val();
          console.log("RadioText:" + radioText);
          //saveProfileData(totalData);
          //window.location.replace("http://localhost:3000/results");
        });

        //}
      });
  });


}
