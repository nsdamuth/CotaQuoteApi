const ApiAccess = require("../src/General/access_api.js");
const api       = new ApiAccess();
const app_query = require('../graphql/support/applications.exists.qraphql.json')

async function check_authenticated(req, res, next) {
    if(not_empty(req?.headers?.["x-api-key"])) {
        let body = JSON.parse(JSON.stringify(app_query))
        body = api.build_graph({query: {id: req.headers["x-api-key"]}}, body, undefined)
        let response = await api.perform_request(undefined, res, body)
        console.log("Authed ", response)
        next()
    } else {
        res.sendStatus(403)
    }
    // next()
}

function not_empty(val) {
    if(val !== undefined && val !== null) {
        if(val !== "") return true
    }
    return false
}

module.exports = { check_authenticated }