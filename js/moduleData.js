function getModuleData() {
const UKIE_ADDRESS = "localhost:3000/";
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

firebase.database().ref('Modules').once('value').then(function(snapshot) {
  var num = snapshot.val().ModuleNum;

    firebase.database().ref("Modules").once('value').then(function(snapshot) {
      for(var i = 1; i <= num; i++) {
        console.log("In!")
        var url = snapshot.child("Module" + i + "/ModuleData").val().url;
        var text = snapshot.child("Module" + i + "/ModuleData").val().text;
        var node = document.createElement("li");              // Create a <li> node
        var imgnode = document.createElement("img"); 
        var linknode = document.createElement("a");                
        imgnode.setAttribute("src", url);
        linknode.setAttribute("href", UKIE_ADDRESS + "module/" + i);
        linknode.appendChild(imgnode);
        var textnode = document.createElement("p");         // Create a text node
        textnode.innerHTML = text;
        node.appendChild(linknode);
        node.appendChild(textnode);                              // Append the text to <li>
        node.id = "Module" + i;
        document.getElementById("dataStore").appendChild(node);     // Append <li> to <ul> with id="dataStore"
        // ...
      }
    });
});
}
