function getQuestionBlockData() {

  const UKIE_ADDRESS = "http://localhost:3000/";

  var currentPathname = window.location.pathname;
  var currentModule = currentPathname.split("module/")[1];
  currentModule = currentModule.split("/exercise")[0];
  var currentExercise = currentPathname.split("exercise/")[1];

  firebase.database().ref('Modules/Module' + currentModule + "/Exercise" + currentExercise).once('value').then(function(snapshot) {
    var num = snapshot.val().QuestionBlockNum;

      firebase.database().ref("Modules/Module" + currentModule + "/Exercise" + currentExercise).once('value').then(function(snapshot) {
        for(var i = 1; i <= num; i++) {
          console.log("In!")
          var url = snapshot.child("QuestionBlock" + i + "/QuestionBlockData").val().url;
          var text = snapshot.child("QuestionBlock" + i + "/QuestionBlockData").val().text;
          var node = document.createElement("li");              // Create a <li> node
          var imgnode = document.createElement("img"); 
          var linknode = document.createElement("a");                
          imgnode.setAttribute("src", url);
          linknode.setAttribute("href", UKIE_ADDRESS + "module/" + currentModule + "/exercise/" + i + "/questionblock/" + i + "/question/1");
          linknode.appendChild(imgnode);
          var textnode = document.createElement("p");         // Create a text node
          textnode.innerHTML = text;
          node.appendChild(linknode);
          node.appendChild(textnode);                              // Append the text to <li>
          node.id = "QuestionBlock" + i;
          document.getElementById("dataStore").appendChild(node);     // Append <li> to <ul> with id="dataStore"
          // ...
        }
      });
  });


}
