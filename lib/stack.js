var request = require('request');
var urlModule = require('url');
var buildPassword = process.env['buildPassword'];
var Sha1 = require('./sha1.js');

var Host = process.env['towerUrl'] || 'https://admin:admin@tower-2.innovation.labs.redhat.com';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

function getLaunchUrl(templateId){
	if(templateId){
		return '/api/v1/job_templates/' + templateId + '/launch/';
	}
	return false;
}

function sanitizeName(dirtyName){
	if(dirtyName){
		return dirtyName.replace(/\s+/g, '-').toLowerCase();
	}
	return false;
}

function sendRequest(url, params, cb){

	var config_body = {
		"extra_vars" : { "stack_configuration" : {}}
	};

	config_body.extra_vars['stack_configuration'] = params;

	var options = {
		url: url,
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		},
		json: config_body
	};

	request(options, function (error, response) {
		// console.log('*********RESPONSE**********************');
		// console.log(response);
		// console.log('**********END RESPONSE*****************');
		if (!error && response.statusCode >= 200 && response.statusCode < 300) {
			// console.log(body) // Show the HTML for the Google homepage.
			cb(null, 'Successful Launch with Ansible tower job ID: '+response.body.job);
		} else {
			if (!error) {
				error = 'Unknown error';
	 		}
	  		cb(error,null);
	  	}
	})
} 


function createProject(body, params, cb){
	var uri = getLaunchUrl(13);
	var url = Host + uri;
	console.log('calling '+ url);


	sendRequest(url, params, cb);
}


function launchNodeApp(body, params, cb){
	var uri = getLaunchUrl(12);
	var url = Host + uri;
	console.log('calling '+ url);

	sendRequest(url, params, cb);
}

function checkPassword(body, cb){
	if (buildPassword){
		if(body && body.buildPasswordHash){
			if (body.buildPasswordHash == Sha1.hash(buildPassword)){
				processStack(body, cb);
			} else {
				cb( null, 'invalid buildPassword specified');
			}
		} else {
		  cb( null,'no buildPassword specified');
		}
	} else {
		processStack(body, cb);
	}
}
function processStack(body, cb){
	console.log('processling');
	if (body && body.projectName && body.getUrl) {
		var params = urlModule.parse(body.getUrl, true).query;
		params['project_name'] = sanitizeName(body.projectName);

		if ('node' in params && params['node'] == "true") { 
			launchNodeApp(body, params, cb);
		} else {
			createProject(body, params, cb);
		}
	} else {
		cb('no extra_vars specified', null);
	}
	


}

exports.checkPassword = checkPassword;
