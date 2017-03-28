var express    = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'ukie',
  password : 'ukie',
  database : 'ukie'
});

// Look into escaping all variables used with mysql in this file


function checkConjugations (слова, sectNum) {
    connection.connect();

    слова = слова.toLowerCase();

    connection.query('SELECT ' + sectNum + ' FROM conjugations WHERE слови =' + слова, function(err, rows, fields) {
    if (!err) {
        if (rows.length >= 2) {
            for (var i = 0; i < rows.length; i++) {
                if(слова === rows[i].toLowerCase()) {
                    return true;
                }
            }
            return rows;
        }
        else if (слова === rows.toLowerCase()) {
            return true;
        }
        return rows;
    }
    else
        console.log('Error while performing Query.');
    });

    connection.end();
}

function checkSentences (речення, sectNum) {

    connection.connect();

    речення = речення.toLowerCase();

    connection.query('SELECT ' + sectNum + ' FROM sentences WHERE речення =' + речення, function(err, rows, fields) {
    if (!err) {
        if (rows.length >= 2) {
            for (var i = 0; i < rows.length; i++) {
                if(речення === rows[i].toLowerCase()) {
                    return true;
                }
            }
            return rows;
        }
        else if (речення === rows.toLowerCase()) {
            return true;
        }
        return rows;
    }
    else
        console.log('Error while performing Query.');
    });

    connection.end();

}
// !!Not yet started
function checkSpeech () {
}

function getText () {
    connection.connect();

    connection.query('SELECT * FROM text', function(err, rows, fields) {
    if (!err) {
        if (rows.length >= 2) {
            for (var i = 0; i < rows.length; i++) {
                return rows[i];
            }
        }
        else
            return rows;
    }
    else
        console.log('Error while performing Query.');
    });

    connection.end();
}
// !!Not yet started
function addWord (слова) {
}
// !!Not yet started
function addSentence (речення) {
}