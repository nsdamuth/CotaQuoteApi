const router = require('express').Router({ mergeParams: true });
const distance_controller = require("../controllers/distanceController.js")

// IMPORT MIDDLEWARE
const version_middleware = require('../middleware/version.middleware.js')

router.get('/', version_middleware(1), distance_controller.distance)

module.exports = router;