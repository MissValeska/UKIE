const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
  res.sendFile(__dirname +  "/index.html")
})

app.get('/success', function (req, res) {
  res.sendFile(__dirname + "/success.html")
})

app.get('/modules', function (req, res) {
  res.sendFile(__dirname + "/modules.html")
})

app.get('/module/:modNum', function (req, res) {
  res.sendFile(__dirname + "/exercises.html")
})

app.get('/module/:modNum/exercise/:excNum', function (req, res) {
  res.sendFile(__dirname + "/questionblock.html")
})

app.get('/tos', function (req, res) {
  res.send("Nothing!");
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 3000')
})
