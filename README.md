requestah
============
**lean** HTTP wrapper for `node.js` that makes unit testing your HTTP API's a bit less rough.

       
Installation
============
	
	npm install requestah

Basic Usage
============
	
    var r = require('requestah')(80); // Set the port for future requests
    
    // Basic HTTP GET:
    r.get('/users', function(res) {
    	if (res.statusCode === 200) { console.log(res.body); }
    });
    
    // HTTP POST with data:
    r.post('/users', {name: "John Doe"}, function(res) {
    	if (res.statusCode === 200) { console.log(res.body); }
    });
    
    // External HTTP GET:
    r.get('http://www.example.org', function(res) {
        if (res.statusCode === 302) { console.log("We got redirected to " + res.headers.location); }
    });
    

Advanced usage
============

 	// HTTP GET with querystrings passed as object
    r.get('/users', {ageMin: 30, ageMax: 50} function(res, dbg) {
    	if (res.statusCode === 200) { console.log(res.body); }
    });
    
    // HTTP GET with querystrings passed in path - performs exactly the same request as above would do
    r.get('/users?ageMin=30&ageMax=50', function(res, dbg) {
    	if (res.statusCode === 200) { console.log(res.body); }
    });
    
    // HTTP DELETE with a header for only this request
    r.del('/users/john', {headers: {apikey: "verySecretKey"}}, function(res) {
    	if (res.statusCode === 204) { console.log(res.body); }
    });
    
    // Set a fixed HTTP header for all future requests. Helpful for authentication 
    r.setHeader('apikey', 'b4080ca70d5617...');

    // HTTP PUT with data & headers:
    r.put('/users/john', {name: "Jane Doe", headers: {adminkey: "IGOTADMINRIGHTS"}}, function(res, req) {
    
    	if (res.statusCode === 204) { console.log(res.body); }
    	console.log(req.params); // => params: {name: "Jane Doe"}
    	
    	// Note that both the above set apikey and the per-request adminkey have been sent in the request:
    	console.log(req.headers); // => headers: {apikey: 'b4080ca70d5617...', adminkey: 'IGOTADMINRIGHTS'}
    });
    
    
    // HTTP POST with enforced Content-Type:
    r.post('/users', {name: "John Doe", type: "form"}, function(res, req) {
    	console.log(req['Content-Type']); // => 'application/json'
    });

    // Activate debug mode - future requests will not be performed. Only request options are returned:
    r.setDebug(true);
    
    // Check out the available debug information
    r.post('/users', {name: "John Doe", type: "form"}, function(res, req) {
		
		console.log(res); // res => false
		
		console.log(req); 
		/*
	     req => {
		    port: 80,
		    method: 'POST',
		    path: '/users',
		    headers: {apikey: 'b4080ca70d5617...', adminkey: 'IGOTADMINRIGHTS'},
		    'Content-Type': 'application/json'
		    params: {name: "John doe"},
		    parsedParams: '{"name": "John Doe"}',
	     }
     	*/
		    
    });
    
API
============

`requestah.`
  * `get(path, data, callback)`
  * `post(path, data, callback)`
  * `put(path, data, callback)`
  * `del(path, data, callback)`
    * `path` - [REQUIRED] - The URL to fetch. Can be either relative to root, ie. `/users` or but also an full path, `http://www.google.com` 
    * `data` - [OPTIONAL] - The data to be sent along with the request. Is appended automatically as a querystring to the path for HTTP GET requests, or converted into JSON automatically for POST/PUT/DELETE.
      * `headers` - [OPTIONAL] - The eventual headers to send along with the requests. Does overwrite any previously set fixed headers
      * `type` - [OPTIONAL] - A way to force content-type -encoding of the request to be either `form` `application/x-www-form-urlencoded`, or `json` (application/json)
    * `callback` - [REQUIRED] - The callback to be fired once the request is complete. Returns two arguments: `response` & `request`
    	* `response` - The actual node response object. False if in debug mode. Please visit the [official node.js documentation] for full documentation : http://nodejs.org/api/http.html#http_class_http_serverrequest
    	* `request` - The arguments used to create the request. Useful for debugging and the only argument returned if in debug mode.
     
  * `setFixedHeader(key, value)` - Sets a fixed header to be included with all future requests. Useful to set HTTP Auth headers.
  * `setDebug(bool)` - Activates debugging, which means that no actual HTTP requests will be perfomed. Watch the second argument (request) in the callbacks for detailed debug information.    	

Checkout the tests in `test/test-main.js` for actual examples and usecases.

License
============

See `LICENSE` file.

> Copyright (c) 2012 Joakim B

