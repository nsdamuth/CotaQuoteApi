const handle_errors = (err, req, res, next) => {
    // console.log("handle_errors::", res?.status)
    console.log("err", err)
    // if(res?.status === 401) {
    //     return res.sendStatus(401)
    // }
    next(res)
}

module.exports = handle_errors;