// REQUEST IMPORT
const ApiAccess             = require("../src/General/access_api.js");
const { notnull, reda }   = require("../src/General/support_funcs.js")
const api = new ApiAccess();

const geolocation_query = require('../graphql/places/geolocation.query.graphql.json')
const geolocation_exists = require('../graphql/places/geolocation.exists.graphql.json')
const geolocation_create = require('../graphql/places/geolocation.mutation.graphql.json')

const get_geolocation = async function(req, res, next) {
    /*
    #swagger.tags = ['Geo-Location']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Check if geolocation exists in the database by zip code."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/num']
    */
    let numerics = ["latitude", "longitude"]
    req.query = api.remap_keys(req.query, {"lat": "latitude", "lng": "longitude", "long": "longitude"})
    let body = JSON.parse(JSON.stringify(geolocation_query))
    body = api.build_graph(req, body, numerics)
    let response = await api.perform_request(req, res, body)
    if (notnull(response?.data)) {
        const firstKey = Object.keys(response?.data)[0];
        return res.send(response?.data[firstKey])
    } else {
        return res.send({})
    }
}
const expose_check_location = async function(req, res, next) {
    return res.send(await check_geolocation(req, res))
}
const check_geolocation = async function(req, res, next) {
    /*
    #swagger.tags = ['Location']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Check if location exists in the database by zip code."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/num']
    */
   let numerics = ["latitude", "longitude"]
    req.query = api.remap_keys(req.query, {"lat": "latitude", "lng": "longitude", "long": "longitude"})
    let body = JSON.parse(JSON.stringify(geolocation_exists))
    body = api.build_graph(req, body, numerics)
    let response = await api.perform_request(req, res, body)
    if (notnull(response?.data)) {
        const firstKey = Object.keys(response?.data)[0];
        if (response?.data[firstKey]?.totalCount > 0) {
            return {exists: true, id: response?.data?.allGeolocations?.nodes?.[0]?.id}
        }
    }
    return {exists: false}
}
const ensure_geolocation = async function({args, res}) {
    /*
    #swagger.tags = ['Location']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Ensure (create if it does not exist) if location exists in the database by zip code."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/num']
    */
    let check_args = {lat: args?.query.latitude, long: args?.query.longitude}
    let loc_exists = await check_geolocation({query: check_args}, res)
    if (loc_exists?.exists) {
        return {exists: true, created: false, id: loc_exists?.id}
    }
    return await create_geolocation({args: args.query, res: res})
}
const expose_ensure_geolocation = async function(req, res, next) {
    return res.send(await ensure_geolocation({args: {req: req, query: req.body}, res: res}))
}
const search_geolocation = async function(req, res, next) {
    /* Note: fix/restapi-012-geolocation-search-empty-handler
        search_geolocation() is intentionally deferred for later implementation.
        Current risk: if this route is active and called, the request may hang because no response is sent.
        When revisiting, either implement the search flow or return an explicit placeholder response
        such as an empty object or 501 Not Implemented.
    */
    return res.status(501).send({error: "Not implemented", error_num: 501})
}
const create_geolocation = async({args, res}) => {
    /*
    #swagger.tags = ['Location']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Ensure (create if it does not exist) if Geolocation exists in the database by latitude and longitude."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/num']
    */
    let numerics = ["latitude", "longitude"]
    args = api.remap_keys(args, {"lat": "latitude", "lng": "longitude", "long": "longitude"})
    let body = JSON.parse(JSON.stringify(geolocation_create))
    args.latlong = {x: args?.latitude, y: args?.longitude}
    body = api.build_graph({query: {geolocation: args}}, body, numerics)
    let response = await api.perform_request(args, res, body)
    return ({exists: true, created: true, id: response?.data?.createGeolocation?.geolocation?.id})
}
module.exports = { get_geolocation, search_geolocation, check_geolocation, ensure_geolocation, expose_check_location, expose_ensure_geolocation }