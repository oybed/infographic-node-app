var request = require('request');
var urlModule = require('url');

var Host = process.env['towerUrl'] || 'https://admin:admin@tower-2.innovation.labs.redhat.com';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

function getUrl(params, uri){
	return 'https://' + params['demo_username'] + ':' + params['demo_password'] + '@tower.demo.rht-labs.com' + uri;
}

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

//	var config_body = {
//		"extra_vars" : { "stack_configuration" : {}}
//	};

//	config_body.extra_vars['stack_configuration'] = params;
	var config_body = {
		"extra_vars" : {}
	};
	config_body['extra_vars'] = params;

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
	var url = getUrl(params, uri);
	console.log('calling '+ url);


	sendRequest(url, params, cb);
}


function launchNodeApp(body, params, cb){
	var uri = getLaunchUrl(12);
	var url = getUrl(params, uri);
	console.log('calling '+ url);

	sendRequest(url, params, cb);
}

function launchDemo(body, params, cb){
	var uri = getLaunchUrl(7);
	var url = getUrl(params, uri);
	console.log('calling '+ url);

	sendRequest(url, params, cb);
}


function processStack(body, cb){

	if (body && body.projectName && body.getUrl) {
		var params = urlModule.parse(body.getUrl, true).query;
		params['demo_project_name'] = sanitizeName(body.projectName);
		params['demo_scm_url'] = body.gitRepo;
		params['demo_username'] = body.username;
		params['demo_password'] = body.buildPassword;

		if ('node' in params && params['node'] == "true") { 
			launchDemo(body, params, cb);
		} else {
			createProject(body, params, cb);
		}
	} else {
		cb('no extra_vars specified', null);
	}

}

exports.processStack = processStack;
