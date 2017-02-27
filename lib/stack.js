var request = require('request');
var urlModule = require('url');

var AnsibleTowerUrl = process.env['ANSIBLE_TOWER_URL'];
var AnsibleTowerTemplateId = process.env['ANSIBLE_TOWER_TEMPLATE_ID'];
var OpenShiftAPIUrl = process.env['OPENSHIFT_API_URL'];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


function getTemplateLaunchUri(){
	return '/api/v1/job_templates/' + AnsibleTowerTemplateId + '/launch/';
}


function getOpenShiftAuthUri() {
	return '/oauth/authorize?response_type=token&client_id=openshift-challenging-client';
}


function getRequestUrl(params, server, uri){
	return 'https://' + params['demo_username'] + ':' + params['demo_password'] + '@' + server + uri;
}


function sanitizeName(dirtyName){
	if(dirtyName){
		return dirtyName.replace(/\s+/g, '-').toLowerCase();
	}
	return false;
}


function sendTowerRequest(params, cb){
	var uri = getTemplateLaunchUri();
	var url = getRequestUrl(params, AnsibleTowerUrl, uri);

	// Password no longer needed - delete it...
	delete params['demo_password'];

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

	// options_string = JSON.stringify(options, null, 4);
	// console.log('calling options: ' + options_string);

	request(options, function (error, response) {
		// console.log('*********RESPONSE**********************');
		// console.log(response);
		// console.log('**********END RESPONSE*****************');
		if (!error && response.statusCode >= 200 && response.statusCode < 300) {
			// console.log(body)
			cb(null, 'Successful Launch with Ansible Tower job ID: ' + response.body.job);
		} else {
			if (!error) {
				error = 'ERROR: Failed to launch Ansible Tower job. Please check your input and try again.';
	 		}
	  		cb(error, null);
	  	}
	})
} 


function launchRequest(params, cb){
	var uri = getOpenShiftAuthUri();
	var request_url = getRequestUrl(params, OpenShiftAPIUrl, uri);

	var options = {
		url: request_url
	};

	request(options, function (error, response) {
		if (!error && response.statusCode >= 200 && response.statusCode < 300) {
			var token = response.request.uri.hash.match(/access_token=([^&]+).*/)
			params['demo_token'] = token[1];
			sendTowerRequest(params, cb);
		} else {
			if (!error) {
				error = 'ERROR: Failed to obtain OpenStack token. Please check your credentials and try again.';
	 		}
	  		cb(error, null);
	  	}
	});
}


function processStack(body, cb){

	if (body && body.projectName && body.getUrl) {
		var params = urlModule.parse(body.getUrl, true).query;
		params['demo_projectname'] = sanitizeName(body.projectName);
		params['demo_scm_url'] = body.gitRepo;
		params['demo_username'] = body.username;
		params['demo_password'] = body.buildPassword;

		if (('node' in params) && 
		    (params['node'] == "true")) { 
			launchRequest(params, cb);
		} else {
			cb('WARNING: No Valid Technologies selected. Please check your selections and try again.', null);
		}
	} else {
		cb('ERROR: No extra_vars specified.', null);
	}

}

exports.processStack = processStack;
