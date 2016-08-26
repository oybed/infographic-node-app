releasePipeline{
    buildCommands = ['npm install -only=dev'] // Add this when we figure out , 'npm run-script validate']
    buildTool = 'node-0.10'
    ocHost = 'master1.env2-1.innovation.labs.redhat.com'
    dockerRegistry = 'registry.apps.env2-1.innovation.labs.redhat.com'
    appName = 'node-app'
    envs = [
        [name: 'Dev', projectName: 'infographic-dev'],
        [name: 'Stage', projectName: 'infographic-stage' ],
        [name: 'Demo', projectName: 'infographic-demo' ]
   ]
}
