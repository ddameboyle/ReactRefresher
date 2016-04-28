var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var WORDS_FILE = path.join(__dirname, 'savedWords.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/savedWords', function(req, res) {
  fs.readFile(WORDS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/savedWords', function(req, res) {
  fs.readFile(WORDS_FILE, function(err, data) {
    if (err) {
      console.error("ERROR INSIDE SERVER.JS", err);
      process.exit(1);
    }
    var words = JSON.parse(data);
    var newWord = {
      id: Date.now(),
      word: req.body.word,
      definition: req.body.definition,
      partOfSpeech: req.body.partOfSpeech
    };
    words.push(newWord);
    fs.writeFile(WORDS_FILE, JSON.stringify(words, null, 4), function(err) {
      if (err) {
        console.error("ERROR IN RES of Server.js", err);
        process.exit(1);
      }
      res.json(words);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
