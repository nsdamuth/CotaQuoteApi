const router = require('express').Router({ mergeParams: true });
const location_controller = require("../controllers/locationController.js")

// IMPORT MIDDLEWARE
const version_middleware = require('../middleware/version.middleware.js')

router.get('/', version_middleware(1), location_controller.get_location)
router.get('/exists', version_middleware(1), location_controller.expose_check_location)
router.post('/ensure', version_middleware(1), location_controller.expose_ensure_location)

module.exports = router;