// MODULE IMPORTS
const router = require('express').Router({ mergeParams: true });
// IMPORT MIDDLEWARE
const { check_authenticated } = require("../middleware/authentication.middleware.js")

// Configure routes
router.use('/api/:version', check_authenticated, require('./external.js')
    /* #swagger.parameters['version'] = { in: 'path', required: true, default: 'v1', description: 'The version of the Api.' } */
)

module.exports = router;