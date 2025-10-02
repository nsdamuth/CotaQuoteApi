// MODULE IMPORTS
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const externalDocument = require('./docs/external/swagger.json');
const internalDocument = require('./docs/internal/swagger.json');

// Logging
const logCon    = require('./src/Logging/logger.js')
const logger    = logCon.getLogger()

// LOCAL IMPORTS
const configs                   = require('./configs.json');

// ASSIGNMENTS
const port            = (configs !== undefined) ? configs.port : 8000;
const internalPort    = (configs !== undefined) ? configs.internalPort : port + 1;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// IMPORT ROUTES
const routes = require('./routes/routes.js')
const keycloak = require('./routes/keycloak.js')

// IMPORT MIDDLEWARE
const { check_authenticated } = require('./middleware/authentication.middleware.js')

// EXPRESS ROUTES
// app.use('/auth', keycloak)

// app.use('/api/:version', check_authenticated, routes
    /* #swagger.parameters['version'] = { in: 'path', required: true, default: 'v1', description: 'The version of the Api.' } */
// )
app.use((req, res, next) => {
    console.log('Matched API version:', req.params.version);
    console.log('Incoming path:', req.originalUrl);
    next();
}, check_authenticated, routes);


// SWAGGER UI
const customCss = `
    .swagger-ui .topbar { 
        display: none; 
    }
    .swagger-ui .curl-command {
        display: none; 
    }
`

const options = {
    customCss: customCss,
    customSiteTitle: "Cota",
    // customfavIcon: "/api-docs/public/favicon.ico",
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(externalDocument, options));

// FOR DOCUMENTING MULTIPLE API's
// app.use('/internal-docs', swaggerUi.serve, swaggerUi.setup(internalDocument, options));

// Configure ports for listening
app.listen(port, () => {
    logger.info(`Server Listening at ${port}`);
});

app.listen(internalPort, () => {
    logger.info(`Internal Server Listening at ${internalPort}`);
});