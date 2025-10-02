const router = require('express').Router({ mergeParams: true });
const stripe_controller = require("../../controllers/internal/stripeController.js");

router.post('/create-checkout-session', stripe_controller.create_checkout_session)

router.get('/session-status', stripe_controller.session_status)

module.exports = router;