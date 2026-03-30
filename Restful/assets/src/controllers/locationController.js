// REQUEST IMPORT
const ApiAccess             = require("../src/General/access_api.js");
const { notnull, reda }     = require("../src/General/support_funcs.js")
const api = new ApiAccess();

const { ensure_geolocation }    = require("./geolocationController.js")

// Pre-made Graph Query
const location_exists = require('../graphql/places/location.exists.graphql.json')
const location_query = require('../graphql/places/location.query.graphql.json')
const location_create = require('../graphql/places/location.mutation.graphql.json')


const ensure_location = async function({args, res}) {
    /*
    #swagger.tags = ['Location']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Ensure (create if it does not exist) if location exists in the database by zip code."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/num']
    */
    let loc_exists = await check_location({query: args?.query}, res)
    if (loc_exists?.exists) {
        loc_exists.created = false
        return loc_exists
    }
    return await create_location({args: args.query, res: res})
}
const expose_ensure_location = async function(req, res, next) {
    return res.send(await ensure_location({args: {req: req, query: req.body}, res: res}))
}
const check_location = async function(req, res) {
    /*
    #swagger.tags = ['Location']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Check if location exists in the database by zip code."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/num']
    */
    let body = JSON.parse(JSON.stringify(location_exists))
    body = api.build_graph(req, body)
    let response = await api.perform_request(req, res, body)
    if (notnull(response?.data)) {
        const firstKey = Object.keys(response?.data)[0];
        if (response?.data[firstKey]?.totalCount > 0) {
            return {exists: true, loc: response?.data?.allLocations?.nodes?.[0]}
        }
    }
    return {exists: false}
}
const expose_check_location = async function(req, res, next) {
    return res.send(await check_location(req, res))
}
const create_location = async({args, res}) => {
    let geolocation_args = {}
/* Note: fix/restapi-011-location-create-zip-guard
   Verify intended behavior when create_location() is called without args.zip.
   Current behavior may intentionally fall through / return null-like behavior.
   If missing zip should hard-fail, add an upfront guard before geocode fetch.
*/
    try {
        // https://maps.googleapis.com/maps/api/geocode/json?address=78613&key=AIzaSyDc2tRjptiKJ_jxgKo5lZfGkeujFbk7Q-o
        let API_KEY = "AIzaSyDc2tRjptiKJ_jxgKo5lZfGkeujFbk7Q-o"
        let response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+args?.zip+'&key='+API_KEY)
        const json  = await response.json();
        args = mapGeocodeResultToArgs(json)
        geolocation_args = extractLatLong(json)
    } catch (err) {
        console.log(err)
    }
    // await ensure_geolocation({args: {req: req, query: req.body}, res: res})
    let geolocation = await ensure_geolocation({args: {req: args, query: geolocation_args}, res: res})
    args.geolocationId = geolocation?.id
    
    let body = JSON.parse(JSON.stringify(location_create))
    // args.latlong = {x: args?.latitude, y: args?.longitude}
    body = api.build_graph({query: {location: args}}, body, undefined)
    let response = await api.perform_request(args, res, body)
    return ({exists: true, created: true, loc: response?.data?.createLocation?.location})
}
const mapGeocodeResultToArgs = (geoResult) => {
    const args = {};

    if (!geoResult?.results?.length) {
        return args;
    }

    const components = geoResult.results[0].address_components;

    for (const comp of components) {
        if (comp.types.includes("locality")) {
            args.city = comp.long_name;
        }
        if (comp.types.includes("administrative_area_level_1")) {
            args.state = comp.short_name; // or long_name if you want "California"
        }
        if (comp.types.includes("administrative_area_level_2")) {
            args.county = comp.long_name;
        }
        if (comp.types.includes("country")) {
            args.country = comp.long_name; // or short_name if you want "US"
        }
        if (comp.types.includes("postal_code")) {
            args.zip = comp.long_name; // or short_name if you want "US"
        }
    }

    return args;
}
const extractLatLong = (geoResult) => {
  if (!geoResult?.results?.length) {
    return {};
  }

  const { lat, lng } = geoResult.results[0].geometry.location;

  return {
    latitude: lat,
    longitude: lng
  };
}

const get_location = async (req, res, next) => {
    /*
    #swagger.tags = ['Location']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Check if location exists in the database by zip code."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/num']
    */
    let body = JSON.parse(JSON.stringify(location_query))
    body = api.build_graph(req, body)
    let response = await api.perform_request(req, res, body)
    if (notnull(response?.data)) {
        const firstKey = Object.keys(response?.data)[0];
        return res.send(response?.data[firstKey])
    } else {
        return res.send({})
    }
}
module.exports = { get_location, ensure_location, check_location, expose_ensure_location, expose_check_location }