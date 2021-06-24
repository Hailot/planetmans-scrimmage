const swaggerAutogen = require('swagger-autogen')()


const doc = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "Planetmans Scrimmage Data Api",
        description: "Documentation for the Data"
    },
    servers:[
        {
          "url": "https://planetmans-scrimmage.herokuapp.com",
          "description":" Production server (uses live data) " 
        },
        {
          "url": "http://localhost:3000",
          "description":" Local development server (requires running app locally) " 
        }
    
      ],
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