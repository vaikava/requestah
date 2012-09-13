var assert = require("assert"),
	app = require("./testapp.js"),
	port = 3000,
	r = require("../lib/requestah.js")(port);

describe('requestah', function() {

	describe("Does setup requests properly", function() {

		it('Enters debug mode', function() {
			var dbg = r.setDebug(true);
			assert.equal(dbg, true);
		});
			
		it('HTTP GET', function(done) {
	
			r.get('/path', function(res) {
				assert.deepEqual(res.opts.path, '/path')
				assert.deepEqual(res.opts.port, port);
				assert.deepEqual(res.opts.method, "GET");
				assert.deepEqual(res.opts.headers, {});
				assert.deepEqual(res.params, {});
				assert.deepEqual(res.parsedParams, {});
				done();
	
			});
		});
	
		it('HTTP POST', function(done) {
	
			r.post('/path', function(res) {
				assert.deepEqual(res.opts.path, '/path')
				assert.deepEqual(res.opts.port, port);
				assert.deepEqual(res.opts.method, "POST");
				assert.deepEqual(res.opts.headers, {});
				assert.deepEqual(res.params, {});
				assert.deepEqual(res.parsedParams, {});
				done();
	
			});
		});
	
		it('HTTP PUT', function(done) {
	
			r.put('/path', function(res) {
				assert.deepEqual(res.opts.path, '/path')
				assert.deepEqual(res.opts.port, port);
				assert.deepEqual(res.opts.method, "PUT");
				assert.deepEqual(res.opts.headers, {});
				assert.deepEqual(res.params, {});
				assert.deepEqual(res.parsedParams, {});
				done();
	
			});
		});
	
		it('HTTP DELETE', function(done) {
	
			r.del('/path', function(res) {
				assert.deepEqual(res.opts.path, '/path')
				assert.deepEqual(res.opts.port, port);
				assert.deepEqual(res.opts.method, "DELETE");
				assert.deepEqual(res.opts.headers, {});
				assert.deepEqual(res.params, {});
				assert.deepEqual(res.parsedParams, {});
				done();
	
			});
		});
		
	
	});

	describe("Can add headers correctly", function(done) {
		
		it('Adds a fixed header', function() {
			var headers = r.setFixedHeader("fixedkey", "fixedvalue")
			assert.equal(headers.fixedkey, "fixedvalue")
		});
		
		it('Adds a runtime header', function(done) {
	
			r.get('/path', {headers: {key: "value"}}, function(res) {
				assert.deepEqual(res.opts.path, '/path')
				assert.deepEqual(res.opts.port, port);
				assert.deepEqual(res.opts.method, "GET");
				assert.deepEqual(res.opts.headers, {fixedkey: "fixedvalue", key: "value"});
				assert.deepEqual(res.params, {});
				assert.deepEqual(res.parsedParams, {});
				done();
			});
		});
		
		it('Temporarily overwrites fixed headers with runtime ones', function(done) {
			
			var randValue = Math.floor(Math.random() * 1000) + 1

			r.get('/path', {headers: {fixedkey: randValue}}, function(res) {
				
				assert.deepEqual(res.opts.path, '/path')
				assert.deepEqual(res.opts.port, port);
				assert.deepEqual(res.opts.method, "GET");
				assert.deepEqual(res.opts.headers, {fixedkey: randValue});
				assert.deepEqual(res.params, {});
				assert.deepEqual(res.parsedParams, {});
				done();
			});
			
		});
		
	});
	
	
	describe("Can perform HTTP requests properly", function() {

		it('Exits debug mode', function() {
			var dbg = r.setDebug(false);
			assert.equal(dbg, false);
		});
			
		it('HTTP GET', function(done) {
			r.get('/', function(res) {
				assert.equal(res.statusCode, 200);
				assert.equal(JSON.parse(res.body).reqType, "get");
				
				// Ensure that we sent our fixed header here and that no
				// content-type was enforced
				assert.deepEqual(JSON.parse(res.body).headers.fixedkey, "fixedvalue");
				assert.deepEqual(JSON.parse(res.body).headers["content-type"], undefined);
				
				done();
	
			});
		});
	
		it('HTTP POST (as JSON)', function(done) {
			r.post('/', {key: "value"}, function(res, dbg) {
				assert.equal(res.statusCode, 200);
				assert.equal(JSON.parse(res.body).reqType, "post");
				
				// application/json should be set as it's default
				assert.deepEqual(JSON.parse(res.body).headers["content-type"], "application/json");
				assert.deepEqual(JSON.parse(res.body).postdata, {key: "value"});
				done();
			});
		});

		it('HTTP POST (as form)', function(done) {
			r.post('/', {key: "value", type: "form"}, function(res, dbg) {
				assert.equal(res.statusCode, 200);
				assert.equal(JSON.parse(res.body).reqType, "post");
				
				// application/json should be set as it's default
				assert.deepEqual(JSON.parse(res.body).headers["content-type"], "application/x-www-form-urlencoded");
				assert.deepEqual(JSON.parse(res.body).postdata, {key: "value"});
				done();
			});
		});
		
		it('HTTP PUT', function(done) {
			r.put('/', {key: "value"}, function(res, dbg) {
				assert.equal(res.statusCode, 200);
				assert.equal(JSON.parse(res.body).reqType, "put");
				assert.deepEqual(JSON.parse(res.body).headers["content-type"], "application/json");
				assert.deepEqual(JSON.parse(res.body).postdata, {key: "value"});
				done();
			});
		});
		
			
	});
	
	
});

