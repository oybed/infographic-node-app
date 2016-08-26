var proxyquire = require('proxyquire');
var mockRequest = function(options, cb){

	var successResponse = {
		"statusCode":202,
		"body":{
			"job": 17
		},
		"headers":{
			"date":"Tue, 19 Jul 2016 16:14:58 GMT",
			"server":"Apache/2.4.6 (Red Hat Enterprise Linux) OpenSSL/1.0.1e-fips mod_wsgi/3.4 Python/2.7.5",
			"vary":"Accept,Cookie",
			"allow":"GET, POST, HEAD, OPTIONS",
			"x-api-time":"0.114s",
			"connection":"close",
			"transfer-encoding":"chunked",
			"content-type":"application/json"
		},
		"request":{
			"uri":{
				"protocol":"https:",
				"slashes":true,
				"auth":"admin:admin",
				"host":"tower.demo.innovation.redhat.com",
				"port":443,
				"hostname":"tower.demo.innovation.redhat.com",
				"hash":null,
				"search":null,
				"query":null,
				"pathname":"/api/v1/job_templates/7/launch/",
				"path":"/api/v1/job_templates/7/launch/",
				"href":"https://admin:admin@tower.demo.innovation.redhat.com/api/v1/job_templates/7/launch/"
			},
			"method":"POST",
			"headers":{
				"authorization":"Basic YWRtaW46YWRtaW4=",
				"content-length":0
			}
		}
	};
  console.log(options.json.extra_vars.stack_configuration);
  if(options.json.extra_vars.stack_configuration.project_name !== 'testproject'){
    cb('Incorrect project_name');
  }else if (options.url == 'https://admin:admin@tower.demo.innovation.redhat.com/api/v1/job_templates/8/launch/'){
		cb(null, successResponse, successResponse.body);
	} else {
		cb('incorrect url', null);
	}
}
   
describe('processStack calls', function () {
  it('should return success', function (done) {
  	var stack = proxyquire('../../lib/stack.js', {'request': mockRequest});
  	stack.processStack( {projectName: 'testProject', getUrl:"http://127.0.0.1/"},function(err, response){
		response.should.equal('Successful Launch with Ansible tower job ID: 17');
		done();
  	});
  });
  it('should return no extra_vars specified', function (done) {
  	var stack = proxyquire('../../lib/stack.js', {'request': mockRequest});
  	stack.processStack( {projectName: 'testProject'},function(err, response){
		err.should.equal('no extra_vars specified');
		done();
  	});
  });
  it('should return error no extra_vars specified', function (done) {
  	var stack = proxyquire('../../lib/stack.js', {'request': mockRequest});
  	stack.processStack( {},function(err, response){
		err.should.equal('no extra_vars specified');
		done();
  	});
  });
});
