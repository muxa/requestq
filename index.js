var Q = require('q');
var request = require('request');

function createWrapper(request, options) {
  if (!request)
    throw new Error("Must request object as first argument");
  if (!request.get)
    throw new Error("Not a request object");

  if (!options) {
    options = {};
  }

  if (options.log === undefined) {
    options.log = true;
  } 

  if (options.wrapError === undefined) {
    options.wrapError = true;
  } 


  return {
    head: function(url) {
	    var deferred = Q.defer();

	    if (options.log) console.log("nead", url);

	    request.get(url, function(error, response, body){
	        if (error) {
	        	if (options.log) console.log("error getting", url);
	            deferred.reject(options.wrapError ? new Error(error) : error);
	        } else {
	        	if (options.log) {
		            console.log("%j returned %j", url, response.statusCode);
	        	}
	        	
	            deferred.resolve(response);
	        }
	    });

	    return deferred.promise;
	},
    get: function(url) {
	    var deferred = Q.defer();

	    if (options.log) console.log("get", url);

	    request.get(url, function(error, response, body){
	        if (error) {
	        	if (options.log) console.log("error getting", url);
	            deferred.reject(options.wrapError ? new Error(error) : error);
	        } else {
	        	if (options.log) console.log("%j returned %j (content length: %j)", url, response.statusCode, response.body.length);
	            deferred.resolve(response);
	        }
	    });

	    return deferred.promise;
	}
  };
}


module.exports = createWrapper;