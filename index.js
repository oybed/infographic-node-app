var express = require('express');
var cors = require('cors');
var app = express();
var stack = require('./lib/stack');
var bodyParser = require('body-parser');
var buildPassword = process.env['buildPassword'];
app.use(cors());
app.use(bodyParser());
app.post('/stack', function (req, res) {
	console.log(req.body);
	console.log('in /stack route');
	stack.checkPassword(req.body,function(err, response){
		if (err){
			res.status(500).send(err);
		} else {
			res.send(response);
		}
	});
});

app.get('/passwordRequired', function(req, res){
	if (buildPassword){
		res.send(true);
	} else {
		res.send(false);
	}
	
})

app.get('/', function (req, res) {
	console.log(req.body);
	console.log('in / route');
	res.send('Hello, World! This is version 0.6.0')
});

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});
