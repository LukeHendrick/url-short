'use strict';

var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var url = require('url');
var uri = process.env.MONGOLAB_URI;
let short;
let seq = 1
MongoClient.connect(uri, function(err, db) {
  if (err) {
    console.log('There was an error connecting to the database: ' + err);
  } else {
    short = db.collection('short');

    app.use(express.static('public'));

    app.get("/", function (req, res) {
      res.sendFile(__dirname + '/views/index.html');
    })
    app.get("/new/*", function (request, response) {
      var reqDoc = {"original": request.params[0], "userId": Math.floor(1000 + Math.random() * 9000 )}
      var userId = reqDoc.userId.toString();;
      short.insertOne(reqDoc);
      response.send("Your new url is: " + request.get('host') + '/' + userId)
    });
    app.get("/:id", (req, res) => {
      let newId = Number(req.params.id)
      short.find({"userId": newId}).toArray(function (err, docs) {
        var redirect = docs[0].original
        res.redirect(redirect)
      })
    })
    console.log('Success!');
    let port = process.env.PORT || 3000;
    var listener = app.listen(port, function () {
        console.log('Your app is listening on port ' + listener.address().port);
    });
  }
})
