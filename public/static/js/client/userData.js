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

function listInventoryItems(snapshot) {

  //var inventoryData = getInventory();

  for(var i = 1; i <= snapshot.val().InNum; i++) {
    console.log("In inventory!")
    var url = snapshot.child("item" + i).val().url;
    var name = snapshot.child("item" + i).val().name;
    var count = snapshot.child("item" + i).val().count;
    var shortDesc = snapshot.child("item" + i).val().shortDesc;
    var node = document.createElement("li");              // Create a <li> node
    var imgnode = document.createElement("img"); 
    var linknode = document.createElement("a");
    var span = document.createElement("span");                
    imgnode.setAttribute("src", url);
    span.setAttribute("class", "photo");
    span.appendChild(imgnode);
    linknode.setAttribute("href", "index#");
    linknode.appendChild(span);
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var span3 = document.createElement("span"); 
    span1.setAttribute("class", "subject");
    span2.setAttribute("class", "from");
    span2.innerHTML = name;
    span3.setAttribute("class", "time");
    span3.innerHTML = count;
    span1.appendChild(span2);
    span1.appendChild(span3);
    linknode.appendChild(span1);
    var spanmsg = document.createElement("span");
    spanmsg.setAttribute("class", "message");
    spanmsg.innerHTML = shortDesc;
    linknode.appendChild(spanmsg);
    node.appendChild(linknode);                             // Append the text to <li>
    node.id = "item" + i;
    document.getElementById("inventorybox").appendChild(node);     // Append <li> to <ul> with id="dataStore"
    // ...
  }

  var node = document.createElement("li");
  var linknode = document.createElement("a");
  linknode.setAttribute("href", "http://127.0.0.1:3000/inventory");
  linknode.innerHTML = "See all items";
  node.appendChild(linknode);
  document.getElementById("inventorybox").appendChild(node);

}

const LIST = 10;

function getInventory(i) {

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

    firebase.database().ref('users/' + userData.uid + "/Inventory").once('value').then(function(snapshot) {
      //try {
        snapshot;
        console.log("InNum:" + snapshot.val().InNum);
        if(i != LIST) {
          document.getElementById("itemnum").innerHTML = "You have " + snapshot.val().TotalNum + " items in your inventory";
          document.getElementById("totalcount").innerHTML = snapshot.val().TotalNum;
        }
        else if(i == LIST) {
          listInventoryItems(snapshot);
        }
      /*}
      catch(err) {
        console.log(err.message);
      }*/
    });
  });

}

function getProfileUrl() {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log("User img:" + user.photoURL);
      document.getElementById("userimg").setAttribute("src", user.photoURL);
    } else {
      console.log("not signed in!")
      //login();
      // No user is signed in.
    }
  });

}

function getUsername() {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log("Username:" + user.displayName);
      document.getElementById("username").innerHTML = user.displayName;
    } else {
      console.log("not signed in!")
      //login();
      // No user is signed in.
    }
  });

}

const GOOGLE = 0;
const FACEBOOK = 1;
const TWITTER = 2;

function chooseProvider(i) {

  var provider;

  var valid = false;

  if(i == GOOGLE) {

    console.log("Google chosen");

    provider = new firebase.auth.GoogleAuthProvider();

    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    provider.addScope('https://www.googleapis.com/auth/plus.login');

    provider.addScope('https://www.googleapis.com/auth/userinfo.email');

    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

    valid = true;

  }

  else if(i == FACEBOOK) {

    console.log("Facebook chosen");

    provider = new firebase.auth.FacebookAuthProvider();

    provider.addScope('public_profile');

    provider.addScope('user_friends');

    provider.addScope('user_about_me');

    provider.addScope('email');

    provider.addScope('user_birthday');

    valid = true;

  }

  else if(i == TWITTER) {

    console.log("Twitter chosen");

    provider = new firebase.auth.TwitterAuthProvider();

    valid = true;

  }



  if(valid) {
    login(provider)
  }

}

function login(provider) {

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;

  console.log("Success!");
  console.log("Token:" + token);
  console.log("User:" + user.email);
  //console.log("More email stuff:" + firebase.currentUser.displayName);

  userData = user;

  window.location.replace(UKIE_ADDRESS + "profile");

  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;

  console.log("Failure!" + errorCode + " :" + errorMessage + " :" + email + " :" + credential);

  // ...
});

}
