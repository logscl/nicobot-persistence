var express         = require('express');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var expressResource = require('express-resource');
var compression     = require('compression');
var Config          = require('./Config');

var MessageEndpoint = require('./message/MessageEndpoint');
var LinkEndpoint    = require('./link/LinkEndpoint');
var Authentication  = require('./auth/Authentication');

console.log("Server is starting ...");

var app = express();

app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(compression());

app.use(Authentication.authenticateUser);

console.log("Creating routes ...");

app.resource('messages', MessageEndpoint);
app.resource('links', LinkEndpoint);

console.log("Routes : ");
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
})


app.listen(Config.SERVER_PORT);
console.log("Node server listening on " + Config.SERVER_PORT);