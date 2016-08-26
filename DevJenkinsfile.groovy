developmentPipeline{
    buildCommands = ['npm install -only=dev'] // Add this when we figure out , 'npm run-script validate']
    unitTestCommand = 'npm test'
    buildTool = 'node-0.10'
    ocHost = 'master1.env2-1.innovation.labs.redhat.com'
    projectName = 'infographic'
    appName = 'node-app'
    qualityScanCommand = 'run sonar qube'
    dockerRegistry = 'registry.apps.env2-1.innovation.labs.redhat.com'
}
