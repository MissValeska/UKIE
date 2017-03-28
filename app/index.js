var express = require('express')
var bodyParser = require('body-parser');
const ukie = require('./ukie')

var app = express()

app.get('/gettext', function (req, res) {
  res.send(ukie.getText())
})

app.get('/checkconj', function (req, res) {
  res.send(ukie.checkConjugations(req.body.text))
})

app.get('/checksentence', function (req, res) {
  res.send(ukie.checkSentences(req.body.text))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})