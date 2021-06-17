const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        version: "1.0.0",
        title: "Planetmans Scrimmage Data Api",
        description: "Documentation for the Data"
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "Match",
            "description": "Match endpoints"
        }
    ],
    securityDefinitions: {
        // apiKeyAuth:{
        //     type: "apiKey",
        //     in: "header",       // can be "header", "query" or "cookie"
        //     name: "X-API-KEY",  // name of the header, query parameter or cookie
        //     description: "any description..."
        // }
    },
    definitions: {
        
    }
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index')           // Your project's root file
})