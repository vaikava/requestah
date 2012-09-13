http        = require("http")
querystring = require("querystring")
url         = require("url")

module.exports = (port) ->
  new Requestah(port)

class Requestah

  constructor: (port) ->
    @port = port or 80 
    @headers = {}
    this

  get: (uri, params, callback) ->
    @request "GET", uri, params, callback

  post: (uri, params, callback) ->
    @request "POST", uri, params, callback
    
  put: (uri, params, callback) ->
    @request "PUT", uri, params, callback
  
  del: (uri, params, callback) ->
    @request "DELETE", uri, params, callback    
    
  setFixedHeader: (k, v) ->
    @headers[k] = v
    @headers

  setDebug: (v) ->
    @debug = v
    @debug
    
  request: (method, uri, params, callback) ->
    
    # Allow shortcalling without params
    if typeof(callback) is "undefined"
      callback = params
      params = {}
     
    # Create the options object with default opts     
    uri = url.parse(uri, true)
    
    options = 
      port:    @port
      method:  method ? 'GET'
      path:    uri.path
      headers: {}
    
    # Append host if we got one
    options.host = uri.host if uri.hostname
    
    # Pull any properties from @headers & params.headers
    # into the params.headers object
    for i of @headers
      options.headers[i] = @headers[i]
    
    for i of params.headers
      options.headers[i] = params.headers[i]
    
    # Cleanup the params obj
    delete params.headers

    # Add eventual params as a querystring after the URL
    if Object.keys(params ).length isnt 0 and method is "GET"
      # Ignore Content-type for HTTP GET
      delete params['Content-Type']
      
      parsedParams = querystring.stringify(params)
      options.path += "?" + parsedParams
      #options.headers["Content-Type"] = "application/json"
    
    # For HTTP POST & PUT & DEL: Use application/json as default or form when specified
    if Object.keys(params).length isnt 0 and method isnt "GET"
      
      # Application/json is our default content-type
      if not params.type or params.type is "json"
        delete params['type']
        #delete params['Content-Type']
  
        parsedParams = JSON.stringify(params)
        options.headers["Content-Type"] = "application/json"
        
      else if params.type is "form"
      
        delete params['type']
        #delete params['Content-Type']
  
        parsedParams = querystring.stringify(params)
        options.headers["Content-Type"] = "application/x-www-form-urlencoded"
    
    # Do not perform the actual HTTP request if we're in debug mode
    debugData =
      opts: options,
      params: params,
      parsedParams: parsedParams ? {}
      
    return callback debugData if @debug
    
    # Create the request
    req = http.request(options)
  
    # Write our params if we have a POST, PUT or DEL  
    if Object.keys(params).length isnt 0 and method isnt "GET"
      req.write parsedParams 
    
    # Create our response object
    req.on "response", (res) ->
      res.body = ""
      res.setEncoding "utf-8"
      
      # Append chunks
      res.on "data", (chunk) ->
        res.body += chunk
      
      # Invoke callback on end of response
      res.on "end", ->
        callback res, debugData
  
    # End our request
    req.end()
   