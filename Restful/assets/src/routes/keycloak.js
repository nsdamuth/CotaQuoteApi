const router = require('express').Router({ mergeParams: true });
const keycloak_controller = require("../controllers/keycloakController.js")

router.post('/login', keycloak_controller.login)

module.exports = router;
