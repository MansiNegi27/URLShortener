// for manipulating data : performing CRUD operations

//dependencies
const fs = require('fs');
const path = require('path');
const helper = require('./helper');
//creating a container to store the functions
const lib = {};

//Now let's define a path where the data should be stored
lib.baseDir = path.join(__dirname,'/../data/');
//Define the functions to perform the operations I require :
//Create and Read : No requirement for delete and update

lib.create = function(dir, file,data,callback){
  //we have to create a new file and open it, so that data can be stored inside
  fs.open(lib.baseDir+dir+'/'+file +'.json','wx',function(err,fd){
    //fd stands for file descriptor here,
    //fd is a unique integer, different for each file
    if(!err && fd)
    {
      //let's write into the file
      var stringData = JSON.stringify(data);
      fs.writeFile(fd,stringData,function(err){
        if(!err)
        {
          //now close the file
          fs.close(fd,function(err){
            if(!err)
            {
              callback(false);
            }else {
              callback("Error closing the file");
            }
          });
        }else {
          //if one can't write into the file
          callback("Error writing to the file");
        }
      });
    }else {
      //incase of an error in opening the file, callback the error
      callback("Error creating the file as the file may already exist");
    }
  });
};

//to be able to read the contents of the file
lib.read = function(dir,file,callback)
{
  //Start by reading the file
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
    if(!err && data)
    {
      var parsedObject = helper.parseToObject(data);
      callback(false,parsedObject);
    }else {
      callback("error reading from the file or file returned no data");
    }
  });
};

//update the contents of a file
lib.update = function(dir,file,data,callback)
{
  //try to open the file first of all
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fd){
    if(!err && fd)
    {
      //Write to the File
      fs.writeFile(fd,data,function(err){
        if(!err)
        {
          //close the file as well
          fs.close(fd,function(err){
            if(!err)
            {
              callback(false);
            }else {
              callback('Couldnot close the file');
            }
          });
        }else {
          {
            callback('Couldnot find the file');
          }
        }
      });
    }else {
      callback(err);
    }
  });
};



//Export the default container
module.exports = lib;
