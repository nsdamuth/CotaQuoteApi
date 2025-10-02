const configs = require('../../configs.json');
const devConfig = require('../../dev_configs.json');
const definitions = require("../doc_properties/definitions.js")
const tags = require("../doc_properties/tags.js")
const info = require("../doc_properties/info.js")
const components = require("../doc_properties/components/components.js")

const config = (process.env.REACT_APP_DEVMODE) ? devConfig : configs
const host = (process.env.REACT_APP_DEVMODE) ? config.swagger.host : `https://rest.${process.env.REACT_APP_DOMAIN}`

const doc = {
    info: info,
    consumes: ['application/json'],  // by default: ['application/json']
    produces: ['application/json'],  // by default: ['application/json']
    tags: tags,
    servers: [
        { url: host },
        // { url: config.auth.host, description: "Auth server" }
    ],
    components: components,
    securityDefinitions: {
        CotaApiKey: {
            type: "apiKey",
            in: "header",      
            name: "X-API-KEY"
        },
        // bearerAuth: {
        //     type: 'http',
        //     in: 'header',
        //     scheme: 'bearer'
        // }
    },  // by default: empty object
    security: [{
        CotaApiKey: [],
        // bearerAuth: []
    }],
    definitions: definitions         // by default: empty object (Swagger 2.0)
};

const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'}); // Need to explicitly define use of OpenApi 3.0 here.

const outputFile = './docs/internal/swagger.json';
const endpointsFiles = ['./server.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);
