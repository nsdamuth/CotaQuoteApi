// REQUEST IMPORT
const ApiAccess = require("../src/General/access_api.js");
// const { notnull, reda, isNum, splitIntoPairs }  = require("../src/General/support_funcs.js")
const Support = require("../src/General/support_funcs.js")
const { ensure_location }    = require("./locationController.js")
const api = new ApiAccess();

const distance_query = require('../graphql/places/distance.query.graphql.json')
const distance_create = require('../graphql/places/distance.mutation.graphql.json')

const distance = async (req, res, next) => {
    res.send(await determine_distance({args: req.query}))
}
const determine_distance = async ({args}) => {
    let unit_divisor = 1609
    let units = "imperial"
    let units_name = "miles"
    if (args.units === "km") {
        unit_divisor = 1
        units = "metric"
        units_name = "km"
    }
    let chunks = []
    if ((Support.notnull(args?.start) || Support.notnull(args?.stop)) && !Support.notnull(args?.zips)) {
        chunks[0] = [args?.start, args?.stop]
    } else {
        if (Support.notnull(args?.zips)) {
            if (args?.zips.length > 0) {
                chunks = Support.chunk(args?.zips)
            }
        }
    }
    let result  = {units: units, units_name: units_name, duration: 0, total_distance: 0, float_distance: 0, ave_complexity: 0, distances: [], haversines: [], complexities: [], raw_time: 0, total_time: 0, haversine: 0, complexity: 0, raw_distance: 0}
    for(let i in chunks) {
        let start   = await ensure_location({args: {query: {zip: chunks[i][0]}}, res: undefined})
        let stop    = await ensure_location({args: {query: {zip: chunks[i][1]}}, res: undefined})
        let haversine = haversine_distance({mk1: {lat: start?.loc?.geolocationByGeolocationId?.latitude, lng: start?.loc?.geolocationByGeolocationId?.longitude}, mk2: {lat: stop?.loc?.geolocationByGeolocationId?.latitude, lng: stop?.loc?.geolocationByGeolocationId?.longitude}})
        haversine = (isNaN(haversine)) ? 0 : haversine
        let distance = (await get_distance({args: {query: {startLocationId: start.loc?.id, endLocationId: stop.loc?.id}}}))?.nodes[0]
        if (distance?.distance === 0 || !Support.notnull(distance?.distance)) {
            distance = await query_google_api({stops: [start, stop], objargs: {startLocationId: start.loc?.id, endLocationId: stop.loc?.id}, haversine: haversine})
        }
        // Distance is retrieved and stored in Meters. 
        // use (distance / 1609) to get result in miles
        if (distance !== undefined) {
            distance.complexity     = (isNaN(distance.complexity)) ? 0 : distance.complexity
            result.float_distance   = result.float_distance + (distance.distance / unit_divisor)
            result.total_distance   = result.total_distance + parseInt(distance.distance) / unit_divisor
            result.raw_distance     = (Support.notnull(distance?.distance)) ? distance.distance : 0
            result.distances.push(parseInt(distance.distance / unit_divisor))
            result.raw_time         = result.raw_time + parseInt((Support.notnull(distance.duration)) ? distance.duration : 0)
            result.total_time       = result.total_time + parseInt(((Support.notnull(distance.duration)) ? distance.duration : 0))
            result.haversine	    = result.haversine + haversine
            result.haversines.push(haversine)
            result.complexity	    = result.complexity + parseFloat(distance.complexity)
            result.complexities.push(parseFloat(distance.complexity))
            result.duration         = result.duration + distance.duration
        }
    }
    result.total_time = Support.convert_time(result.total_time)
    result.ave_complexity = (result.complexity / chunks.length)
    return result
}
const get_distance = async ({args}) => {
    let body = JSON.parse(JSON.stringify(distance_query))
    body = api.build_graph(args, body)
    let response = await api.perform_request(args, undefined, body)
    if (Support.notnull(response?.data)) {
        const firstKey = Object.keys(response?.data)[0];
        return response?.data[firstKey]
    } else {
        return
    }
}
const query_google_api = async ({stops, objargs, haversine}) =>{
    if (Array.isArray(stops)) {
        // Move to .env file?
        const API_KEY	    = "AIzaSyDc2tRjptiKJ_jxgKo5lZfGkeujFbk7Q-o"
        const units		    = "imperial"
        let origins		    = stops[0]?.loc?.ity+Support.comma(stops[0]?.loc?.state)+Support.comma(+stops[0]?.loc?.zip)
        let destinations	= stops[1]?.loc?.city+Support.comma(stops[1]?.loc?.state)+Support.comma(+stops[1]?.loc?.zip)
        let format		    = "json"
        let mode            = "driving"
        let url             = "https://maps.googleapis.com/maps/api/distancematrix/"+format+"?destinations="+destinations+"&origins="+origins+"&units="+units+"&key="+API_KEY+"&mode="+mode
        let result          = await (await Support.request({url: url, method: "GET"})).json()
        if (result?.rows?.[0]?.elements?.[0]?.status === "NOT_FOUND") {
            // Possible update this later for a backup resolver
            return
        }
        if (objargs === undefined) {
            objargs = {}
        }
        objargs.distance = result?.rows?.[0]?.elements?.[0]?.distance?.value
        objargs.duration = result?.rows?.[0]?.elements?.[0]?.duration?.value
        objargs.haversine = haversine
        if (haversine !== 0.0) {
            objargs.complexity = 1-(haversine / objargs.distance) 
        } else {
            objargs.complexity = 0
        }
        objargs.complexity = objargs.complexity.toString()
        if (Support.notnull(objargs.distance)) {
            return await create_distance(objargs)
        }
    }
    return
}
const create_distance = async (args) => {
    let body    = JSON.parse(JSON.stringify(distance_create))
    body        = api.build_graph({query: {distance: args}}, body, undefined)
    let response = await api.perform_request(args, undefined, body)
    return response
}
const haversine_distance = ({mk1, mk2}) => {
    if (Support.isNum(mk1) && Support.isNum(mk2)) {
        var R = 3958.8; // Radius of the Earth in miles
        var rlat1 = mk1.lat * (Math.PI/180); // Convert degrees to radians
        var rlat2 = mk2.lat * (Math.PI/180); // Convert degrees to radians
        var difflat = rlat2-rlat1; // Radian difference (latitudes)
        var difflon = (mk2.lng-mk1.lng) * (Math.PI/180); // Radian difference (longitudes)

        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
        return d * 1609;
    }
}
module.exports = { distance, determine_distance }