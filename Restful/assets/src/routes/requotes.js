const router = require('express').Router({ mergeParams: true });
const quotes_controller = require("../controllers/quotesController.js")

// IMPORT MIDDLEWARE
const version_middleware = require('../middleware/version.middleware.js')

router.post('/', version_middleware(1), quotes_controller.requote)

router.post('/:id', version_middleware(1), quotes_controller.requote)


module.exports = router;