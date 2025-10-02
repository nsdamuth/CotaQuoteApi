// MODULE IMPORTS
const router = require('express').Router({ mergeParams: true });

// Expose endpoints to external access.
router.use('/class', require('./class.js'));
router.use('/quotes', require('./quotes.js'));
router.use('/distance', require('./distance.js'));

// PLACES
router.use('/location', require('./location.js'));
router.use('/geolocation', require('./geolocation.js'));
// router.use('/loads', require('./loads.js'));
// router.use('/carriers', require('./carriers.js'));
// router.use('/contacts', require('./contacts.js'));
// router.use('/companies', require('./companies.js'));
// router.use('/trips', require('./trips.js'));

module.exports = router;
