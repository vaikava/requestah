var express = require('express'),
	app = express(),
	ts = new Date();

app.use(express.bodyParser());

app.all('/', function(req, res) {
	
	res.send(JSON.stringify({
		reqType: req.route.method,
		time: Math.round(ts/1000),
		postdata: req.body,
		getdata: req.params,
		headers: req.headers
	}), 200);
		
});

app.listen(3000);