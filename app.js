const express = require('express')
const fs = require('fs');
var path = require('path');
const app = express()

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname +  "/public/views/index.html")
})

app.get('/success', function (req, res) {
  res.sendFile(__dirname + "/public/views/success.html")
})

app.get('/modules', function (req, res) {
  res.sendFile(__dirname + "/public/views/modules.html")
})

app.get('/module/:modNum', function (req, res) {
  res.sendFile(__dirname + "/public/views/exercises.html")
})

app.get('/module/:modNum/exercise/:excNum', function (req, res) {
  res.sendFile(__dirname + "/public/views/questionblock.html")
})

app.get('/module/:modNum/exercise/:excNum/questionblock/:qBlockNum/question/:qNum', function (req, res) {
  res.sendFile(__dirname + "/public/views/question.html")
})

app.get('/tos', function (req, res) {
  res.send("Nothing!");
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 3000')
})
