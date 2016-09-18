/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var Cloudant = require('cloudant');

// Initialize the library with my account.
var cloudant = Cloudant("https://86d20f68-ae6d-47e5-8adc-f9c222b6af94-bluemix:8f2daf28e6ae397ca8ac843a2fe4f325f893bda96e366c5b954ce494d6f6d3d2@86d20f68-ae6d-47e5-8adc-f9c222b6af94-bluemix.cloudant.com");

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

var db = cloudant.db.use('users');

// create a new express server
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.get('/api/search/:name',function(req,res){
  db.search('userDoc', 'userSearch', {q:'name:' + req.params.name }, function(er, result) {
    res.send(result);
  });
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
