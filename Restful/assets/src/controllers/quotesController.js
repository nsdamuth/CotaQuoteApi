// REQUEST IMPORT
const ApiAccess                 = require("../src/General/access_api.js");
const { determine_distance }    = require("./distanceController.js");
const { notnull, removeUndefined, keysToCamelCase }  = require("../src/General/support_funcs.js")
const { determine_class }       = require("./classController.js")
const Distance                  = require("./distanceController.js")
const Location                  = require("./locationController.js")
const { transform, mod_quote }  = require("./transformerController.js")
const api = new ApiAccess();

// QUERY IMPORTS
const quote_mutation = require('../graphql/general/quotes/new_quote.mutation.graphql.json');
const quotes_query = require('../graphql/general/quotes/quote.query.qraphql.json')
const requote_mutation = require('../graphql/general/quotes/requote.mutation.graphql.json')

exports.quotes = async (req, res, next) => {
    /*
    #swagger.tags = ['Quotes']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Retrieve quotes."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/num']
    */
    
    let body = JSON.parse(JSON.stringify(quotes_query)) 
    // body.query	= body.query.replace("allQuotes", 'allQuotes'+api.append_values(req.query))
    let response = await api.perform_request(req, res, body)
    res.send(response)
}

exports.quote_by_id = async (req, res, next) => { 
    /*
    #swagger.tags = ['Quotes']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Get a quote by id."
    #swagger.parameters['$ref'] = ['#/components/parameters/version', '#/components/parameters/id']
    */
    if (req?.originalUrl.includes("quote_number")) {
        req.query.carrierQuoteNumber = req?.params?.id;
        delete req?.params?.id;
    }
    let response = await fetch_quote(req)
    response?.data?.allQuotes?.nodes.forEach((item, index) => {
        delete item.rawQuote
    })
    res.send(response)
}
async function fetch_quote(req) {
    let body = JSON.parse(JSON.stringify(quotes_query))
    body = api.build_graph(req, body)
    let response = await api.perform_request(req, undefined, body)
    return response
}
async function get_min_quote_request(quote, res, next) {
    return {}
}
async function get_truckload_request(quote, res, next) {
    return {}
}
async function get_quote_request(quote, res, next) {
    let quote_number = (notnull(quote?.quote_number)) ? quote?.quote_number : quote.carrierQuoteNumber
    if (Array.isArray(quote?.items)) {
        quote?.items.forEach((item, index) => {
                if (item?.class === undefined) {
                        let density = item.weight / (item.length * item.width * item.height)
                        item.class = determine_class({density: density})
                }
        })
    }
    console.log("----------------------- get_quote_request ------------------------------")
    if (quote?.shipment?.pickup?.zip !== '' && quote?.shipment?.dropoff?.zip !== '') {
        return await handle_request({request_args: quote, quote_number: quote_number})
    }

    res.send({"error": "Invalid Submission", "error_num": 422})
}
exports.generate_quote = async (req, res, next) => {
    /*
    #swagger.tags = ['Quotes']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Get a new quote."
    #swagger.parameters['$ref'] = ['#/components/parameters/version']
    #swagger.requestBody = {
        description: 'Data of the quote',
        required: true,
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/Quote' },
                examples: {
                    quote: { $ref: '#/components/examples/Quote' }
                }
            }
        }
    }
    */
    console.log("--------- GENERATE QUOTE ----------------")
    let quote = req.body
    if (quote?.truckload !== undefined) {
        res.send(await get_truckload_request(req, res, next))
    }
    if (quote?.pallet !== undefined) {
        res.send(await get_min_quote_request(req, res, next))
    }
    res.send(await get_quote_request(quote, res, next))
}

async function perform_request(args) {
    if (notnull(args)) {
        let temp = {}
        temp.total_count = 0
        temp.total_length = 0
        temp.total_width = 0
        temp.total_height = 0
        temp.total_weight = 0
        temp.total_weight = 0
        temp.total_volume = 0
        temp.type = 'pallet'

        let request = {}
        request['DL'] = 2
        request['ID'] = "4X7QC5E5"
        request['FrtLWHType'] = "IN"
        request['TPBAff'] = 'Y'
        request['TPBPay'] = 'Y'
        request['TPBName'] = 'Cota'
        request['TPBCity'] = 'Fargo'
        request['TPBState'] = 'ND'
        request['TPBCountry'] = 'US'
        request['TPBZip'] = '58102'
        request['Acc_NFOT'] = 'Y'
        request['Acc_PALLET'] = 'Y'

        if (notnull(args.value)) {
            request.DeclaredValue - args.value
        }
        if (notnull(args.shipment)) {
            if (notnull(args.shipment.date)) {
                // request.DeliveryDate = args.shipment?.date
                const dateObj = new Date(args.shipment.date);
                request.DeliveryDate = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/` +
                  `${String(dateObj.getDate()).padStart(2, '0')}/` +
                  `${String(dateObj.getFullYear()).slice(-2)}`;
            }
            if (notnull(args.shipment?.pickup)) {
                request = format_request_stops(request, args.shipment.pickup, false)
                request = format_request_stops(request, args.shipment.dropoff, true)
            }
            if (notnull(args.shipment.company?.name)) {
                request.TPBName =  args.shipment.company.name
            }
            let today = new Date()
            const todayStr = today.toISOString().split('T')[0];
            const date = `${today.getFullYear()}-` +
                    `${String(today.getMonth() + 1).padStart(2, '0')}-` +
                    `${String(today.getDate()).padStart(2, '0')}`;
            let dates           = (date).split('-')
            request.ShipYear    = dates[0]
            request.ShipMonth   = dates[1]
            request.ShipDay     = dates[2]
        }
        if (notnull(args?.items)) {
            let items = args.items
            items.forEach((obj, index) => {
                request['UnitType'+(index+1)] = 'PLT'
                request['UnitNo'+(index+1)] = obj['number']
                request['FrtLng'+(index+1)] = obj['length']
                request['FrtWdth'+(index+1)] = obj['width']
                request['FrtHght'+(index+1)] = obj['height']
                request['Wgt'+(index+1)] = obj['weight']
                request['Class'+(index+1)] = obj['class']
                temp.total_count = temp.total_count + parseInt(obj['number'])

                let commodity_length = (parseInt(obj['length']) * parseInt(obj['number']))
                temp.total_length = temp.total_length + commodity_length

                let commodity_width = (parseInt(obj['width']) * parseInt(obj['number']))
                temp.total_width = temp.total_width + commodity_width
                
                let commodity_height = (parseInt(obj['height']) * parseInt(obj['number']))
                temp.total_height = temp.total_height + commodity_height

                let commodity_weight = (parseInt(obj['weight']))
                temp.total_weight = temp.total_weight + commodity_weight

                temp.total_volume = temp.total_volume + ((parseInt(obj['length']) * parseInt(obj['width']) * parseInt(obj['height'])) * parseInt(obj['number']))
                if (!notnull(request['Class'+(index+1)])) {
                    request['Class'+(index+1)] = determine_class({density: temp.total_volume})
                }
            });
        }
        if (notnull(args?.item)) {
            request['UnitType'+1] = 'PLT'
        }
        request.total_weight = temp.total_weight
        // request.total_volume = temp.total_volume
        let url = "http://www.abfs.com/xml/aquotexml.asp?"
        let headers = {
            "x-customer-transaction-id" : "624deea6-b709-470c-8c39-4b5511281492",
            "x-locale": "en_US"
        }
        let x_customer_transaction_id = "624deea6-b709-470c-8c39-4b5511281492"
        let x_locale = "en_US"
        let authorization = ""
        Object.keys(request).forEach((obj, index) => {
            url = url+obj+"="+request[obj]+"&"
        })
        let qoute_result = await api.perform_post(url, undefined, headers)
        qoute_result.total_volume = temp.total_volume
        // Evaluation $.ABF.NUMERRORS, gt 0 handle failure
        if (qoute_result.abf.numerrors > 0) {
            return {"error": "Invalid Submission", "error_num": 422}
        }
        // return qoute_result
        // console.log(qoute_result)
        let qr = transform(qoute_result)
        qr.total_volume = temp.total_volume
        return process_response(qr, args)
        // Ensure request is "application/x-www-form-urlencoded" for: content-type, and mime-type
        // return undefined
    }
    return undefined
}
function process_response(qr, args) {
    args = mod_quote(args)
    let base_values = [1.1, 22.15, 0.99, 35.315];
    let ftl_milage = 5.8;
    let ftl_weight = 25000;
    let days = parseInt(qr['transit'].split()[0])
    let miles = 0
    let remaining_days = days
    let total_weight = (notnull(args?.total_weight)) ? args?.total_weight : 0
    if (days > 1) {
        miles = miles + 300
    }
    if (days >= 2) {
        miles = miles + 300
        remaining_days = days - 2
    }
    if (remaining_days > 0) {
        miles = miles + (remaining_days * 500)
    }
    let calculated_value = miles * base_values[0]
    calculated_value = calculated_value/ftl_milage
    calculated_value = calculated_value * base_values[1] * base_values[2]
    let calculated_weight = total_weight / ftl_weight
    calculated_value = calculated_value * calculated_weight
    calculated_value = calculated_value / base_values[3]
    qr['co2'] = Math.round(calculated_value * 10) / 10;
    qr['days'] = days
    qr['total_height'] = args?.total_height
    qr['total_length'] = args?.total_length
    qr['total_width'] = args?.total_width
    qr['total_weight'] = total_weight
    qr['request'] = args
    qr['vendor'] = "abf"
    return qr
}
function format_request_stops(request, stop, delivery) {
    if (delivery) {
        request.ConsZip = stop?.zip
    } else {
        request.ShipZip = stop?.zip
    }
    if (notnull(stop.shipment?.pickup?.options)) {
        if (delivery) {
            if (notnull(stop.shipment?.pickup?.options?.appointment_required)) {
                request.Acc_ARR = "Y"
                request.TimeKeeper = "Y"
                request.DeliveryDateType = "by"
            }           
        }
        if (notnull(stop.shipment?.pickup?.options?.residential)) {
            request.Acc_RPU = "Y"
        }
        if (notnull(stop.shipment?.pickup?.options?.liftgate)) {
            request.Acc_GRD_PU = "Y"
        }
        if (notnull(stop.shipment?.pickup?.options?.military)) {
            request.LAPType = "M"
            request.Acc_LAP = "Y"
        }
        if (notnull(stop.shipment?.pickup?.options?.trade_show)) {
            request.Acc_TRDSHWO = "Y"
            request.TRDSHWDType = "DTS"
        }
        if (notnull(stop.shipment?.pickup?.options?.inside_delivery)) {
            request.Acc_IPU = "Y"
            if (delivery) {
                request.LADType = "O"
            }
        }
        if (notnull(stop.shipment?.pickup?.options?.limited_access)) {
            request.Acc_LAP = "Y"
            request.LAPType = "O"
        }
    }
    return request
}
async function handle_request({request_args, quote_number}) {
    let dropoff_options = request_args?.shipment?.dropoff?.options
    let pickup_options  = request_args?.shipment?.pickup?.options
    let qr = undefined
    let zips = []
    if (notnull(request_args?.shipment?.pickup?.zip)) {
        zips.push(request_args?.shipment?.pickup?.zip)
    }
    if (notnull(request_args?.shipment?.dropoff?.zip)) {
        zips.push(request_args?.shipment?.dropoff?.zip)
    }
    let distance = await Distance.determine_distance({args: {zips: zips}})
    qr = await perform_request(request_args)
    let rate    = get_rate({roles: ["INTERNAL_COTA_USER"]})
    let quote   = undefined
    if (qr?.Error === undefined && qr !== undefined) {
        if (qr !== undefined && qr?.quote_id !== undefined) {
            let dropoff = (await Location.ensure_location({args: {query: {zip: qr.dropoff?.zip}}, res: undefined}))?.loc
            let pickup  = (await Location.ensure_location({args: {query: {zip: qr.pickup?.zip}}, res: undefined}))?.loc
            let company_id = qr?.request?.shipment?.company?.id
            // BEGIN EXTERNAL CHECK

            if(!notnull(company_id)) {

            }
            if (notnull(company_id)) {

            }
            let quote_args = {carrier_quote_number: qr?.quote_id, dropoff_id: dropoff?.id, pickup_id: pickup?.id, 
                                    weight: qr?.total_weight.toString(), length: qr?.total_length.toString(), height: qr?.total_height.toString(), volume: qr?.total_volume, width: qr?.total_width.toString(),
                                    raw_quote: JSON.stringify(qr).replace(/"/g, '\\"'), transit: qr?.transit, quote_rate: rate.toString(), pickup_date: request_args?.shipment?.date,
                                    co2: qr?.co2.toString(), cost: (qr?.cost * rate).toString(), expires: qr?.expires, effective: qr?.effective, shipping: qr?.shipping, 
                                    days: qr?.days, vendor: qr?.vendor, company_id: company_id,  is_calculated: request_args.is_calculated, distance: distance.raw_distance.toString(),
                                    reference_number: request_args.reference_number, dropoff_options: dropoff_options, pickup_options: pickup_options, start_zip: pickup?.zip, end_zip: dropoff?.zip}
            if (notnull(request_args?.requestor)) {
                quote_args.requestor    = request_args.requestor
            }
            // quote_args.raw_quote = undefined
            quote_args = removeUndefined(quote_args)
            if (notnull(request_args?.email)) {
            //     quote_args.email_id     = (await ensure_email({parent: parent, args: {email: request_args.email}, context: context, singular: true}))?.id
            //     send_email({parent: parent, kv: quote_args, args: {type: "quote", code: "quote", to: request_args.email, context: context, singular: true, indirect: true}})
            }
            quote = await create_or_update({args: quote_args, quote_number: quote_number})
        } else {
            let quote_args = {cost: request_args?.cost, is_calculated: request_args?.is_calculated}
            // quote = await update_quote(quote_args)
        }
    } else {
        return {id: "-1", _type: "Error", carrier_quote_number: qr?.Error}
    }
    return quote
}

async function create_or_update({args, quote_number}) {
    let quote = undefined
    console.log(quote_number)
    if (notnull(quote_number)) {
        quote = await update_quote({args: args, quote_number: quote_number})
    } else {
        quote = await create_quote(keysToCamelCase(args))
    }
    return quote
}
async function create_quote(args) {
    let body    = JSON.parse(JSON.stringify(quote_mutation))
    body        = api.build_graph({query: {quote: args}}, body, undefined)
    let response = await api.perform_request(args, undefined, body)
    return response
}
async function update_quote({args, quote_number}) {
    let input = await format_update_args({args: args})
    let objargs = input?.objargs
    let ids = input?.ids
    let body    = JSON.parse(JSON.stringify(requote_mutation))
    let carrierQuoteNumber = quote_number
    delete args?.carrierQuoteNumber
    body        = api.build_mutagen({key: {carrierQuoteNumber: carrierQuoteNumber}, body: body, args: keysToCamelCase(args)})
    let response = await api.perform_request(args, undefined, {"query": body})
    return response
}
async function format_update_args(args) {
    let quote_number = (args?.carrier_quote_number === undefined) ? args?.carrierQuoteNumber : args?.carrier_quote_number
    let ids = {}
    if (notnull(quote_number)) {
        ids.carrier_quote_number = quote_number
    }
    if (notnull(args?.public_id)) {
        ids.public_id = args?.public_id
    }
    return await update_args_permissions({objargs: args, ids: ids})
}
async function update_args_permissions({objargs, ids}) { 
    return {objargs: objargs, ids: ids}
}
function get_rate({roles}) {
    let multiplier = 1.15
    // BEGIN EXTERNAL CHECK

    // END EXTERNAL CHECK
    if (notnull(roles)) {
        let result = roles.find((role) => role.includes("FREIGHT"));
        let internal = roles.find((role) => role.includes("INTERNAL_COTA_USER"));
        if (notnull(internal)) {
            result = "FREIGHT_00"
        }
        if (notnull(result)) {
            multiplier = 1
            var res = result.split("_");
            multiplier = multiplier + (parseFloat(res[1]) / 100)
        }
    }
    return multiplier
}

exports.requote = async (req, res, next) => {
    /*
    #swagger.tags = ['Quotes']
    #swagger.consumes = ['application/json']
    #swagger.produces = ['application/json']
    #swagger.summary = "Requote an existing quote."
    #swagger.parameters['$ref'] = ['#/components/parameters/version']
    #swagger.requestBody = {
        description: 'Data of the quote',
        required: true,
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/Quote' },
                examples: {
                    quote: { $ref: '#/components/examples/Requote' }
                }
            }
        }
    }
    */
    let quote = undefined
    let quote_params = JSON.parse(JSON.stringify(req.body))
    let quote_number = (notnull(quote_params?.quote_number)) ? quote_params?.quote_number : quote_params.carrierQuoteNumber
    if (!notnull(quote_number)) {
        quote_number = req?.params?.id
    }
    let original_request = undefined
    if (notnull(quote_number)) {
        req.query.carrierQuoteNumber = req?.params?.id;
        delete req?.params?.id
        quote = await fetch_quote(req)
        if (notnull(quote?.data?.allQuotes?.nodes?.[0]?.rawQuote)) {
            original_request = JSON.parse(quote?.data?.allQuotes?.nodes[0].rawQuote)?.request
        }
    }
    if (notnull(original_request)) {
        let update_request = await handle_request({request_args: original_request, quote_number: quote_number})
        res.send(update_request)
        return
    }
    res.send({})
}