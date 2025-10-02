function check_authenticated(req, res, next) {
    // if(not_empty(req?.headers?.["x-api-key"])) {
    //     next()
    // } else {
    //     res.sendStatus(403)
    // }
    next()
}

function not_empty(val) {
    if(val !== undefined && val !== null) {
        if(val !== "") return true
    }
    return false
}

module.exports = { check_authenticated }