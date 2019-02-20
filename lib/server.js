/* Primary file for the server
Contains server logic */

//dependencies
const http = require('http');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./handlers');
const helper = require('./helper');
//Container for the server
var server = {};


server.httpServer = http.createServer(function(req,res)
{
//Request Listener function

//Parse the url that is given in the Request
var parsedUrl = url.parse(req.url,true);
//Now get the pathname from the parsedUrl object
var path = parsedUrl.pathname;
var trimmedPath = path.replace(/^\/+|\/+$/g,'');
//Get the queries, if any are asked ?
var queryStringObject = parsedUrl.query;
//get headers and methods as well from the req object
var method  = req.method.toUpperCase();
var headers = req.headers;

//Finally let's get the payload
var buffer = '';
var decoder = new StringDecoder('utf-8');
//On 'data' event
req.on('data',function(data)
{
  buffer += decoder.write(data);
});
//On 'end' event
req.on('end',function(){
  buffer += decoder.end();
  //Start forming the response
  //Choose an appropriate handler to deal with
  var myHandler = typeof(server.router[trimmedPath]) != 'undefined' ? server.router[trimmedPath] : handlers.notFound;
  //construct the data object to send to the handler
  var sendData = {
    'method' : method,
    'payload' : helper.parseToObject(buffer),
    'headers': headers,
    'path' : trimmedPath,
    'queryStringObject': queryStringObject
  };
  // Now route the request to the chosen handler
  myHandler(sendData,function(statusCode,payload)
{
    //if no status code is returned then display the default statusCode
    statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
    //if no payload is returned by the function, define one thats default
    payload = typeof(payload) == 'object' ? payload : {};
    //Now let's convert the payload objecc to a string_decoder
    var payloadString = JSON.stringify(payload);
    //send the response Now
    res.setHeader('Content-Type','application/json');
    res.writeHead(statusCode);
    res.end(payloadString);
    console.log('Returning the response '+statusCode);
    console.log(payloadString);
  });

});

});

//define a router for handling and redirecting requests to the respective handlers
server.router =
{
  '' : handlers.home,
  'api' : handlers.api
};
server.init = function()
{
    //Tell the server to listen to a port of your choice
    server.httpServer.listen(3000,function(){
      console.log("The server is listening at port 3000");
    });
};
//Export the server object
module.exports = server;
