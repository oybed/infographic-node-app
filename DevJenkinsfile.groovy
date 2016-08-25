developmentPipeline{
    buildCommands = ['npm install -only=dev'] // Add this when we figure out , 'npm run-script validate']
    unitTestCommand = 'npm test'
    buildTool = 'node-0.10'
    ocHost = 'env3-1-master.innovation.labs.redhat.com'
    projectName = 'infographic'
    appName = 'node-app'
    qualityScanCommand = 'run sonar qube'
    dockerRegistry = 'registry.env3-1.innovation.labs.redhat.com'
}