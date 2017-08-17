const express = require('express')
const fs = require('fs');
var path = require('path');
const app = express();

app.set('port', (process.env.PORT || 3000));

// set up static files
app.use(express.static(path.join(__dirname, '/public/static')));


// set up views
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'pug');

// show the home page (will also have our login links)
app.get('/', function(req, res) {
res.render('index')
});

app.get('/index.html', function(req, res) {
res.render('index')
});

app.get('/friends', function(req, res) {
res.render('friends')
});

app.get('/inventory', function(req, res) {
res.render('inventory')
});

app.get('/success', function (req, res) {
res.render('success')
});

app.get('/login', function (req, res) {
res.render('login')
});

app.get('/profile', function (req, res) {
res.render('profile')
});

app.get('/results', function (req, res) {
res.render('results')
});

app.get('/map', function(req, res) {
res.render('map')
});


app.get('/modules', function (req, res) {
  res.render('modules')
});

app.get('/module/:modNum', function (req, res) {
  res.render('exercises')
});

app.get('/module/:modNum/exercise/:excNum', function (req, res) {
res.render('questionblock')
});

app.get('/module/:modNum/exercise/:excNum/questionblock/:qBlockNum/question/:qNum', function (req, res) {
res.render('question')
});

app.get('/tos', function (req, res) {
  res.send("Nothing!");
});

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 3000')
});
