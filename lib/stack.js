var request = require('request');
var urlModule = require('url');

var host = process.env['towerUrl'] || 'https://admin:admin@tower-2.innovation.labs.redhat.com';

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

function processStack(body, cb){

	if (body && body.projectName && body.getUrl){

    var uri = getLaunchUrl(8); //refactor this to
		var url = host + uri;
		console.log('calling '+ url);

		var config_body = {
			"extra_vars" : { "stack_configuration" : {}}
		};

		var params = urlModule.parse(body.getUrl, true).query;
    params['project_name'] = sanitizeName(body.projectName);

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
		  //console.log('*********RESPONSE**********************');
			//console.log(response);
			//console.log('**********END RESPONSE*****************');
		  if (!error && response.statusCode >= 200 && response.statusCode < 300) {
		    cb(null, 'Successful Launch with Ansible tower job ID: '+response.body.job);
		  } else {

		  	if (!error){
		  		error = 'Unknown error';
		  	}
		  	cb(error,null);
		  }
		})
	} else {
		cb('no extra_vars specified', null);
	}


}
exports.processStack = processStack;
