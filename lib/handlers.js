/*
Contains all the request handlers
*/

//dependencies

const _data = require('./data.js');
const helper = require('./helper.js');
const fs = require('fs');
const path = require('path');
//Container to store all the request handlers
var handlers = {};

//for serving static assessts
handlers.baseDir = path.join(__dirname,'/../');

//define handlers
//handles requests to pages not stored on the local host and also for which we have shortened the url
handlers.notFound = function(sendData,callback)
{
  if(sendData.method == 'GET')
  {
    //Check if the url exists inside the folder url, if it does return data inside the file, else return 404
    _data.read('url',sendData.path,function(err,data){
      if(!err && data)
      {
        var obj = {};
        obj.userUrl = data.userUrl;
        callback("userUrl",obj);
      }else {
        callback(404,{'Error':'Url doesnot exist'});
      }
    });
  }else {
    callback(404,{'Error':'Method is not permitted'});
  }
};
//handles all the requests to shorten a particular url
handlers.api = function(sendData,callback){
  //first check if the method is post or not
  if(sendData.method == 'POST')
  {
    //check if the url exists, if it does do nothing and return the previously shortened url
    //verify if the url is legit or note on the client side
    _data.read('user_url',sendData.payload,function(err,data){
      //user already exists
      if(!err && data)
      {
        callback(500,data);
      }else {
        //create the user_url
        //load the key first
        _data.read('key','key',function(err,data){
          if(!err && data)
          {
            var url_no = data.n +1;
            var obj = {};
            obj.n =url_no;
            var str = JSON.stringify(obj);
            _data.update('key','key',str,function(err){
              if(!err)
              {
                  var userUrl = sendData.payload;
                  var userUrlObj = {};
                  var urlNoObject = {};
                  userUrlObj.userUrl = userUrl;
                  urlNoObject.url = url_no;
                  _data.create('url',url_no,userUrlObj,function(err)
                  {
                    if(!err)
                    {
                      _data.create('user_url',userUrl,urlNoObject,function(err){
                        if(!err)
                        {
                          callback(200,urlNoObject);
                        }
                        else {
                          callback(200,urlNoObject);
                        //  callback(404,{'Error': 'Problem creating the user_url'});
                        }
                      });
                    }else {
                      callback(404,{'Error': 'Problem creating the url'});
                    }
                  });
              }else {
                callback(404,{'Error':'Couldnot update the key'});
              }
            });

          }else {
            callback(404,{'Error':'Couldnot find the key file'});
          }
        });
      }
    });
  }
  else {
    callback(404,{'Error' : 'The method is not POST'});
  }
};

//handles requests to show the main page only
handlers.home =function(sendData,callback)
{
 // this is for displaying the home page
  fs.readFile(handlers.baseDir + 'index.html','utf-8',function(err,data){
    if(!err && data)
    {
      callback("homepage",data);
    }else {
      callback(404,{'Error':'Can not find the home page'});
    }
  });

};

//Export the Container
module.exports = handlers;
