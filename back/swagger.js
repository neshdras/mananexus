const swaggerAutogen = require('swagger-autogen')
const doc = {
    info: {
        title: 'API for Mananexus',
        version: '1.0.0',
        description: 'Documentation API'
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http']
}

const outputFile = './swagger-output.json'
const routes = ['./app.js']

swaggerAutogen(outputFile, routes, doc)

// Generate swagger file for :
// node swagger.js