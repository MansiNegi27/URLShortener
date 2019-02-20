//Contains all the helper functions

//dependencies

//Containes all the helper functions
var helper = {};

helper.parseToObject = function(str)
{
    try
    {
        var object = JSON.parse(str);
        return object;
    }
    catch(e)
    {
      return {};
    }
};


//Export this container
module.exports = helper;
