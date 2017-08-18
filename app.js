const express = require('express')
const fs = require('fs');
var path = require('path');
const app = express();
var io = require('socket.io')(80);

var isLoggedin = false;

app.set('port', (process.env.PORT || 3000));

// set up static files
app.use(express.static(path.join(__dirname, '/public/static')));

io.on('connection', function(socket){
  console.log("Hey");
  socket.on('login', function(msg){
    console.log("logged in, from app.js")
    isLoggedin = true;
  });
  socket.on('logout', function(msg){
    console.log("logged out, from app.js")
    isLoggedin = false;
  });
});

// set up views
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'pug');

// show the home page (will also have our login links)
app.get('/', function(req, res) {
  if(isLoggedin) {
    res.render('profile')
  }
  else {
    res.render('index')
  }
});

app.get('/index', function(req, res) {
  if(isLoggedin) {
    res.render('profile')
  }
  else {
    res.render('index')
  }
});

app.get('/index.html', function(req, res) {
  if(isLoggedin) {
    res.render('profile')
  }
  else {
    res.render('index')
  }
});

app.get('/inventory', function(req, res) {
  if(isLoggedin) {
    res.render('inventory')
  }
  else {
    res.render('index')
  }
});

app.get('/friends', function(req, res) {
  if(isLoggedin) {
    res.render('friends')
  }
  else {
    res.render('index')
  }
});

app.get('/glossary', function(req, res) {
res.render('glossary')
});

app.get('/success', function (req, res) {
  if(isLoggedin) {
    res.render('success')
  }
  else {
    res.render('index')
  }
});

app.get('/profile', function (req, res) {
  if(isLoggedin) {
    res.render('profile')
  }
  else {
    res.render('index')
  }
});

app.get('/results', function (req, res) {
  if(isLoggedin) {
    res.render('results')
  }
  else {
    res.render('index')
  }
});

app.get('/map', function(req, res) {
  if(isLoggedin) {
    res.render('map')
  }
  else {
    res.render('index')
  }
});


app.get('/modules', function (req, res) {
  if(isLoggedin) {
    res.render('modules')
  }
  else {
    res.render('index')
  }
});

app.get('/module/:modNum', function (req, res) {
  if(isLoggedin) {
    res.render('exercises')
  }
  else {
    res.render('index')
  }
});

app.get('/module/:modNum/exercise/:excNum', function (req, res) {
  if(isLoggedin) {
    res.render('questionblock')
  }
  else {
    res.render('index')
  }
});

app.get('/module/:modNum/exercise/:excNum/questionblock/:qBlockNum/question/:qNum', function (req, res) {
  if(isLoggedin) {
    res.render('question')
  }
  else {
    res.render('index')
  }
});

app.get('/tos', function (req, res) {
  res.send("Nothing!");
});

app.listen(app.get('port'), function () {
  console.log('Ukie app listening on port 3000')
});
