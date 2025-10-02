const router = require('express').Router({ mergeParams: true });
const class_controller = require("../controllers/classController.js")

// IMPORT MIDDLEWARE
const version_middleware = require('../middleware/version.middleware.js')

router.get('/', version_middleware(1), class_controller.expose_class)

module.exports = router;