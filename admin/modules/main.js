var express = require('express');
var fs = require('fs');

//fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
//  if (err) throw err;
//  console.log('Saved!');
//});



var fileExists = function (callback) {
  fs.exists('./data/post.json', function (exists) {
    if (exists) {
      fs.readFile('./data/post.json', 'utf8', function (err, data) {
        if (err) {
          console.log('error getting json data');
          return;
        }
        var results = JSON.parse(data);
        results = results;
        callback(results);
      });
    } else {

      callback(false);
    }
  });
};

var createjson = function (callback) {

  var obj = {};

  var save = JSON.stringify(obj);
  fs.writeFile('./data/post.json', save, function () {
    console.log('file saved successfully');
    callback()
  });

};

module.exports.fileExists = fileExists;
module.exports.createjson = createjson;