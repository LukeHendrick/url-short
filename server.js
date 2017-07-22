const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const url = require('url');
const uri = process.env.MONGOLAB_URI;
let short;
MongoClient.connect(uri, function(err, db) {
  if (err) {
    console.log('There was an error connecting to the database: ' + err);
  } else {
    short = db.collection('short');

    app.use(express.static('public'));

    app.get("/", (req, res) => {
      res.sendFile(__dirname + '/views/index.html');
    })
    app.get("/new/*", (req, res) => {
      var reqDoc = {"original": req.params[0], "userId": Math.floor(1000 + Math.random() * 9000 )}
      var userId = reqDoc.userId.toString();;
      short.insertOne(reqDoc);
      res.send("Your new url is: " + req.get('host') + '/' + userId)
    });
    app.get("/short/:id", (req, res) => {
      var newId = Number(req.params.id)
      short.find({"userId": newId}).toArray(function (err, docs) {
        if (docs === undefined) {
          res.send('Entry not found!')
          return;
        }
        var redirect = docs[0].original
        res.redirect(redirect)
      })
    })
    console.log('Success!');
    let port = process.env.PORT || 3000;
    let listener = app.listen(port, function () {
        console.log('Your app is listening on port ' + listener.address().port);
    });
  }
})
