const router = require('express').Router({ mergeParams: true });
const quotes_controller = require("../controllers/quotesController.js")

// IMPORT MIDDLEWARE
const version_middleware = require('../middleware/version.middleware.js')

router.get('/', version_middleware(1), quotes_controller.quotes)

router.get('/:id', version_middleware(1), quotes_controller.quote_by_id)

router.get('/quote_number/:id', version_middleware(1), quotes_controller.quote_by_id)

// router.post('/requote', version_middleware(1), quotes_controller.requote)

router.post('/', version_middleware(1), quotes_controller.generate_quote)

module.exports = router;