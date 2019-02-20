/*
Primary file for the api

*/
const server = require('./lib/server.js');

var app = {};

app.init = function() {
  //start the server
  server.init();
};

//call the init function
app.init();

module.exports = app;
