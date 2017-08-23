function getData() {

return firebase.database().ref('Modules').once('value').then(function(snapshot) {
  var username = snapshot.val().ModuleNum;
  console.log(username);
  // ...
});

}
