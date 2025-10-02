const router = require('express').Router({ mergeParams: true });
const geolocation_controller = require("../controllers/geolocationController.js")

// IMPORT MIDDLEWARE
const version_middleware = require('../middleware/version.middleware.js')

router.get('/', version_middleware(1), geolocation_controller.get_geolocation)
router.get('/exists', version_middleware(1), geolocation_controller.expose_check_location)
router.get('/search', version_middleware(1), geolocation_controller.search_geolocation)

// Retain for Testing
// router.post('/ensure', version_middleware(1), geolocation_controller.expose_ensure_geolocation)

module.exports = router;