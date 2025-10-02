// REQUEST IMPORT
const ApiAccess = require("../src/General/access_api.js");
const api = new ApiAccess();

const configs = require("../configs.json");
const devConfig = require('../dev_configs.json');
const config = (process.env.REACT_APP_DEVMODE) ? devConfig : configs
const domain = (process.env.REACT_APP_DEVMODE) ? config.auth.host : `https://auth.${process.env.REACT_APP_DOMAIN}/auth`

exports.login = async (req, res, next) => {
    /*
    #swagger.tags = ['Authentication']
    #swagger.security = []
    #swagger.consumes = ['application/x-www-form-urlencoded']
    #swagger.produces = ['application/json']
    #swagger.summary = "Retrieves an access token to authenticate with the api."
    #swagger.description = "Open the authorize modal and paste the returned token into the input."
    #swagger.requestBody = {
        required: true,
        content: {
            'application/x-www-form-urlencoded': {
                schema: {
                    type: 'object',
                    properties: {
                        username: { type: 'string' },
                        password: { type: 'string', format: 'password'}
                    },
                    required: ['username', 'password']
                }
            }
        }
    }
    */

    let url = domain+"/realms/cota/protocol/openid-connect/token"
    let details = format_body({
            "client_id": "cotaall",
            "client_secret": process.env.REACT_APP_CLIENT_SECRET,
            "grant_type": "password",
            "scope": "openid",
            "username": req.body.username,
            "password": req.body.password
    })
    let result = await request({url: url, details: details})
    result = {
        access_token: result?.access_token,
        expires_in: result?.expires_in
    }
    res.send(result)
}

// exports.reset_password = async (req, res, next) => {
//     /*
//     #swagger.tags = ['Authentication']
//     #swagger.consumes = ['application/x-www-form-urlencoded']
//     #swagger.produces = ['application/json']
//     #swagger.summary = "Reset password."
//     #swagger.requestBody = {
//         required: true,
//         content: {
//             'application/x-www-form-urlencoded': {
//                 schema: {
//                     type: 'object',
//                     properties: {
//                         newPassword: { type: 'string', format: 'password'}
//                     },
//                     required: ['newPassword']
//                 }
//             }
//         }
//     }
//     */

//     let view_url = domain+"/realms/cota/protocol/openid-connect/token/introspect"
//     let bearer = (req.headers['authorization'])?.split(" ")[1]
//     let details = {
//         "client_id": "cotaall",
//         "client_secret": process.env.REACT_APP_CLIENT_SECRET,
//         "token": bearer
//     }
//     let user_details = await request({url: view_url, details: format_body(details)})
//     let id = user_details?.sub
//     console.log(id)
//     // res.send(user_details)
//     // return



//     // let token = await get_admin_token()
//     let url =`${domain}/admin/realms/cota/users/${id}/reset-password`

//     details = {
//         "type": "password",
//         "value": req.body.newPassword
//     }
//     let headers = {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'Authorization': 'Bearer '+token,
//     }

//     console.log(url)
//     console.log(details)
//     console.log(headers)

//     let result = await request({url: url, details: details, custom_headers: headers, method: "PUT"})
//     res.send(result)
// }

// async function get_admin_token() {
//     let url = `${domain}/realms/cota/protocol/openid-connect/token`
//     let details = format_body({
//         "client_id": "cotaall",
//         "client_secret": process.env.REACT_APP_CLIENT_SECRET,
//         "grant_type": "password",
//         "scope": "openid",
//         "username": "admin",
//         "password": process.env.REACT_APP_CLIENT_PASS,    
//     })
//     let result = await request({url: url, details: details})
//     return result?.access_token
// }

async function request({url, details, content_type, method, custom_headers}) {
    let headers = {
        'Content-Type': content_type ?? 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    let options = {
        headers: custom_headers ?? headers,
        method: method ?? "POST",
        body: details
    }
    let result = await fetch(url, options)
    .then(response => {
        if (!response.ok) {
            console.log("HTTP Error "+response.status)
        }
        if (response.status == 200) {
            if (response.headers.get("content-type") === "application/json") {
                return response.json();
            }
            return response
        }
    })
    .catch(error => {
        console.log(error)
    })
    return result
}

function format_body(details) {
    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody
}
