function getExerciseData() {

  const UKIE_ADDRESS = "http://localhost:3000/";

  var currentPathname = window.location.pathname;
  var currentModule = currentPathname.split("module/")[1];

  firebase.database().ref('Modules/Module' + currentModule).once('value').then(function(snapshot) {
    var num = snapshot.val().ExerciseNum;

      firebase.database().ref("Modules/Module" + currentModule).once('value').then(function(snapshot) {
        for(var i = 1; i <= num; i++) {
          console.log("In!")
          var url = snapshot.child("Exercise" + i + "/ExerciseData").val().url;
          var text = snapshot.child("Exercise" + i + "/ExerciseData").val().text;
          var node = document.createElement("li");              // Create a <li> node
          var imgnode = document.createElement("img"); 
          var linknode = document.createElement("a");                
          imgnode.setAttribute("src", url);
          linknode.setAttribute("href", UKIE_ADDRESS + "module/" + currentModule + "/exercise/" + i);
          linknode.appendChild(imgnode);
          var textnode = document.createElement("p");         // Create a text node
          textnode.innerHTML = text;
          node.appendChild(linknode);
          node.appendChild(textnode);                              // Append the text to <li>
          node.id = "Exercise" + i;
          document.getElementById("dataStore").appendChild(node);     // Append <li> to <ul> with id="dataStore"
          // ...
        }
      });
  });


}
