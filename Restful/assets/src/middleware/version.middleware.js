function version_middleware(version) {
    return function(req, res, next) {
        let requestVersion = parseInt(req.params.version.substring(1)); // removes the "v" and turns into a number
        // console.log("requestVersion", requestVersion)
        if (typeof requestVersion !== 'number' || isNaN(requestVersion)) {
            res.status(400).send({message: "Invalid API version requested."})
            return next(new Error("Invalid API version requested."));
        } else if (requestVersion >= version) {
            return next();
        }
        return next("route"); // skip to the next route
    }
}

module.exports = version_middleware