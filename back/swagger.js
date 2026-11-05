const fs = require('node:fs')
const path = require('node:path')
const swaggerJsdoc = require('swagger-jsdoc')
const doc = {
    openapi: '3.0.3',
    info: {
        title: 'API for Nexus Shuffle',
        version: '1.0.0',
        description: 'Documentation API'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'token',
                description: 'JWT lu par authMiddleware dans le cookie token. Les contrôleurs utilisent actuellement des noms différents (tokenAccess, tokenAcess et TokenAcess).'
            },
            refreshCookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'tokenRefresh',
                description: 'JWT de renouvellement fourni à la connexion ou à l’inscription.'
            }
        }
    }
}

const document = swaggerJsdoc({
    definition: doc,
    apis: [path.join(__dirname, 'route/*.js'), path.join(__dirname, 'app.js')]
        .map(file => file.replace(/\\/g, '/')),
    failOnErrors: true
})
fs.writeFileSync(path.join(__dirname, 'swagger-output.json'), JSON.stringify(document, null, 2) + '\n')

// Generate swagger file for :
// node swagger.js
