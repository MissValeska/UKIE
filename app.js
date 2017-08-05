const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
  res.sendFile(__dirname +  "/client/index.html")
})

app.get('/success', function (req, res) {
  res.sendFile(__dirname + "/client/success.html")
})

app.get('/modules', function (req, res) {
  res.sendFile(__dirname + "/client/modules.html")
})

app.get('/module/:modNum', function (req, res) {
  res.sendFile(__dirname + "/client/exercises.html")
})

app.get('/module/:modNum/exercise/:excNum', function (req, res) {
  res.sendFile(__dirname + "/client/questionblock.html")
})

app.get('/tos', function (req, res) {
  res.send("Nothing!");
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 3000')
})
