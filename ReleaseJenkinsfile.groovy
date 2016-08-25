releasePipeline{
    buildCommands = ['npm install -only=dev'] // Add this when we figure out , 'npm run-script validate']
    buildTool = 'node-0.10'
    ocHost = 'env3-1-master.innovation.labs.redhat.com'
	dockerRegistry = 'registry.env3-1.innovation.labs.redhat.com'
    appName = 'node-app'
    
	envs = [
		[name: 'Dev', projectName: 'infographic-dev'],
    	[name: 'Stage', projectName: 'infographic-stage' ],
    	[name: 'Production', projectName: 'infographic-prod' ]
   ]
}