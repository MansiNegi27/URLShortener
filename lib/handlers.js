/*
Contains all the request handlers
*/

//dependencies

const _data = require('./data.js');
const helper = require('./helper.js');

//Container to store all the request handlers
var handlers = {};

//define handlers
//handles requests to pages not stored on the local host and also for which we have shortened the url
handlers.notFound = function(sendData,callback)
{
  if(sendData.method == 'GET')
  {
    //Check if the url exists inside the folder url, if it does return data inside the file, else return 404
    _data.read('url',sendData.payload,function(err,data){
      if(!err && data)
      {
        var obj = {};
        obj.userUrl = data;
        callback(200,obj);
      }else {
        callback(404,{'Error':'Url exists yayyyyy'});
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
                  var shortUrl = url_no;
                  _data.create('url',url_no,userUrl,function(err)
                  {
                    if(!err)
                    {
                      _data.create('user_url',userUrl,url_no,function(err){
                        if(!err)
                        {
                          callback(500);
                        }
                        else {
                          callback(404,{'Error': 'Problem creating the user_url'});
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
    callback(404,{'Error' : 'The method is not PUT'});
  }
};
//handles requests to show the main page only
handlers.home =function(sendData,callback)
{
  //test to check if I can access the key File
/* _data.read('key','key',function(err,data){
    console.log(err,data);
  });*/
  /*_data.update('key','key',"{\"n\": 0}",function(err){
    console.log(err);
  });*/
  callback(500);
};

//Export the Container
module.exports = handlers;
