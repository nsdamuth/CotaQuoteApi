// Logging
const logCon    = require('../Logging/logger.js')
const logger    = logCon.getLogger()
const { keys_with_commas, keys_by_comma_presence, isNum, objToGraphQLString, notblank, keysToLowerCase }   = require("./support_funcs.js")
const { parseStringPromise } = require('xml2js');

// CENTRAL ACCESS POINT FOR MAKING REQUESTS TO GRAPH API
const configs = require("../../configs.json");
const devConfig = require('../../dev_configs.json');
const config = (process.env.REACT_APP_DEVMODE) ? devConfig : configs
const domain = (process.env.REACT_APP_DEVMODE) ? config.cota_api.host : `${process.env.REACT_APP_GRAPH_PROTOCOL}://${process.env.REACT_APP_GRAPH_ADDR}/graphql`

class ApiAccess {
    constructor() {
        if (ApiAccess._instance === undefined) {
            ApiAccess._instance = this
        }
    }
    // security_checks.js line 49: check_application() can be use to authenticate the key
    // support.applications in db
    configure_options({body, token, key}) {
        let content_type = 'application/json';
        let new_headers = undefined
        if(this.notnull(token)) {
            new_headers = {
                'Content-Type': content_type,
                "key": "668083756d0c20076d81c765f1de3b13f28031d6900a76acb4b78ac0a9",
                // "key": process.env.REACT_APP_APP_KEY,
                "Authorization": token
            }
        } else {
            new_headers = { 
                'Content-Type': content_type,
                // "key": "668083756d0c20076d81c765f1de3b13f28031d6900a76acb4b78ac0a9",
                // "key": process.env.REACT_APP_API_KEY,
                "x-api-key": key,
            }
        }
        // Object.keys(new_headers).forEach(key => new_headers[key] === undefined && delete new_headers[key])
        let options = {
            method: "POST",
            headers: new_headers,
            body: JSON.stringify(body),
        }
        return options
    }
    // ON ERROR
    async perform_post(url, body, headers = {}) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // default
                    ...headers,
                },
                body: JSON.stringify(body),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // detect response type
                const contentType = response.headers.get("content-type") || "";
                const text = await response.text();

                if (contentType.includes("application/json")) {
                return JSON.parse(text);
            } else if (contentType.includes("xml") || contentType.includes("html")) {
                // parse XML into JSON
                return keysToLowerCase(await parseStringPromise(text, { explicitArray: false }));
            } else {
                // fallback: raw text
                return text;
            }
        } catch (err) {
            console.error("POST request failed:", err);
            throw err;
        }
    }
    // dynamically adjust the request?
    async perform_request(req, res, body) {
        // let token = req?.headers?.["authorization"]
        let key = req?.headers?.["x-api-key"]
        let token = req?.headers?.["authorization"]
        if(process.env.REACT_APP_DEVMODE) {
            console.log("[query]:", body)
        }
        let options = undefined
        if(this.notnull(token)) {
            options = this.configure_options({body: body, token: token})
        } else {
            options = this.configure_options({body: body, key: key})
        }
        let response_clone;
        console.log(domain)
        console.log(options)
        let response = await fetch(domain, options)
        .then(async response => {
            if (!response.ok) {
                console.error("HTTP Error "+response.status, response.statusText)
                response_clone = response.clone()
                // return {"status": response.status, "message": response.statusText}
            }
            let json_response = await response.json()
            return json_response
        })
        .then(data => data)
        .catch(async rejected => {
            logger.error(`Error performing request to [ ${domain} ]`)
            let text;
            if (response_clone == undefined) { return null }
            try {
                text = await response_clone.text()
            } catch (error) {
                console.log(error)
            }
            
            console.log("rejected:", text, rejected)
            return text
        })
        return response
    }
    notnull(input) {
        if (input !== undefined && input !== null) {
            return true
        }
        return false
    }
    toUnquotedJSON(param){ // Implemented by Frostbolt Games 2022
        if (param !== undefined && param !== null) {
            if(Array.isArray(param)){ // In case of an array, recursively call our function on each element.
                let results = [];
                for(let elem of param){
                    results.push(this.toUnquotedJSON(elem));
                }
                return "[" + results.join(",") + "]";
            } else if(typeof param === "object"){ // In case of an object, loop over its keys and only add quotes around keys that aren't valid JavaScript variable names. Recursively call our function on each value.
                let props = Object.keys(param).map((key) => {
                    if (key.match(/^[a-zA-Z_$][a-zA-Z\d_$]*$/) === null) {
                        return `"${key}":${this.toUnquotedJSON(param[key])}`;
                    } else {
                        return `${key}:${this.toUnquotedJSON(param[key])}`;
                    }
                })
                return `{${props}}`;
            } else { // For every other value, simply use the native JSON.stringify() function.
                return JSON.stringify(param);
            }
        }
        return '""'
    }
    remap_keys(data, mapping) {
        const result = {};

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Use mapped key if exists, else keep original
                const newKey = mapping[key] || key;
                result[newKey] = data[key];
            }
        }

        return result;
    }
    build_mutagen({ key, body, args }) {
        console.log(body)
        // key is an object with a single key/value pair, e.g. { carrierQuoteNumber: "123" }
        const field = Object.keys(key)[0]; // "carrierQuoteNumber"
        const value = key[field];          // "123"

        // Clean args: remove null/undefined
        const cleanedArgs = Object.fromEntries(
            Object.entries(args).filter(([_, v]) => v !== null && v !== undefined)
        );

        // Convert args to GraphQL object string (keys without quotes)
        const graphqlArgs = Object.entries(cleanedArgs)
            .map(([k, v]) => {
            // Quote string values, leave numbers/booleans as-is
            if (typeof v === "string") {
                return `${k}: "${v}"`;
            } else {
                return `${k}: ${v}`;
            }
            })
            .join(", ");

        // Replace the field placeholder
        let mutation = body.query?.replace(
            new RegExp(`${field}:\\s*`, "g"),
            `${field}: "${value}"`
        );

        // Insert args into quotePatch
        mutation = mutation.replace(/quotePatch:\s*/, `quotePatch: {${graphqlArgs}}`);

        return mutation;
    }
    build_graph(req, body, numerics) {
        let has_condition = false
        let has_filter = false
        let base_query = ""
        if (this.notnull(req?.query)) {
            req.query.p = isNaN(req.query?.p) ? 1 : req.query?.p
            req.query.l = isNaN(req.query?.l) ? 10 : req.query?.l
            base_query = "first: "+(req?.query?.l * req?.query?.p)+", offset: "+((req?.query.o === undefined) ? 0 : req?.query?.o)
            delete req?.query?.p
            delete req?.query?.o
            delete req?.query?.l
            body.query	= body.query.replace("nodes", "totalCount pageInfo { hasPreviousPage hasNextPage } nodes")
        }

        let conditions = this.extractAndSplitOperators(req?.query)
        console.log(this.splitMultiParams(conditions?.clean))
        conditions = {...conditions, ...this.splitMultiParams(conditions?.clean)}
        if (Object.keys(conditions?.withoutMultiParams)?.length > 0) {
            let condition_case = "condition"
            if (!body.query.includes(condition_case)) {
                condition_case = "input"
                base_query = ""
            }
            body.query	= body.query.replace(condition_case+":", base_query+(notblank(base_query) ? ', ' : '')+condition_case+': '+objToGraphQLString(conditions?.withoutMultiParams, numerics))
            has_condition = true
        }
        // if (Object.keys(conditions?.withoutMultiParams)?.length > 0) {
        let filters = this.resolveGraphQLFilter(conditions)
        if (Object.keys(filters).length > 0) {
            console.log(filters)
            let prepend = ((!has_condition) ? base_query+", ":"")+'filter: '+objToGraphQLString(filters, numerics)+", "
            body.query = body.query.replace(/condition:/, prepend+"$&");
            has_filter = true
        }
        if (!has_condition) {
            body.query	= body.query.replace("condition:", ((has_filter) ? "" : base_query))
        }
        return body
    }
    resolveGraphQLFilter(input) {
        const {
            keys = {},
            clean = {},
            withInequalities = {},
            multiParams = {},
            // intentionally ignore withoutMultiParams
        } = input;

        // Start with multiParams (e.g., { field: { in: [...] } })
        const result = { ...multiParams };

        // For each field that has inequality operators, attach spelled-out ops
        for (const field of Object.keys(keys)) {
            const ops = Array.isArray(keys[field]) ? keys[field] : [];
            if (ops.length === 0) continue;

            // Prefer values from withInequalities, then fall back to clean
            const fromIneq = Array.isArray(withInequalities[field])
            ? withInequalities[field]
            : (withInequalities[field] !== undefined ? [withInequalities[field]] : []);

            const fromClean = Array.isArray(clean[field])
            ? clean[field]
            : (clean[field] !== undefined ? [clean[field]] : []);

            let iIneq = 0, iClean = 0;
            for (const op of ops) {
            let val;
            if (iIneq < fromIneq.length) {
                val = fromIneq[iIneq++];
            } else if (iClean < fromClean.length) {
                val = fromClean[iClean++];
            } else {
                continue; // no value available for this operator
            }

            // numeric strings -> numbers; otherwise leave as-is
            const num = (typeof val === "string" && val.trim() !== "" && !isNaN(val))
                ? Number(val)
                : val;

            if (!result[field]) result[field] = {};
            result[field][op] = num; // keep spelled-out operator names
            }
        }

        return result;
    }


    splitMultiParams(obj) {
        const multiParams = {};
        const withoutMultiParams = {};

        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

            let value = obj[key];

            if (Array.isArray(value)) {
            if (value.length > 1) {
                multiParams[key] = { in: value };
            } else {
                withoutMultiParams[key] = value[0];
            }
            } else if (typeof value === "string" && value.includes(",")) {
            const values = value.split(",").map(v => v.trim()).filter(v => v.length > 0);
            if (values.length > 1) {
                multiParams[key] = { in: values };
            } else {
                withoutMultiParams[key] = values[0];
            }
            } else {
            withoutMultiParams[key] = value;
            }
        }

        return { multiParams, withoutMultiParams };
    }


    // build_graph(req, body, numerics) {
    //     console.log(body)
    //     console.log(req.query)
    //     let has_condition = false
    //     let has_filter = false
    //     // let inqualities = {keysWithOperators: {}, clean: {}, withInequalities: {}}
    //     let inqualities = this.extractAndSplitOperators(req?.query)
    //     console.log("--- inqualities ---")
    //     console.log(inqualities)
    //     // req.query = inqualities?.clean

    //     let array_keys = keys_by_comma_presence(req?.query)
    //     console.log("--- array_keys ---")
    //     console.log(array_keys)
    //     const withoutCommasObj = array_keys?.withoutCommas.reduce((acc, key) => {
    //         if (!Object.keys(inqualities.withInequalities).includes(key)) {
    //             acc[key] = req?.query[key];
    //             return acc;
    //         }
    //         return acc
    //     }, {});
    //     console.log("--- withoutCommasObj ---")
    //     console.log(withoutCommasObj)
        // if (this.notnull(withoutCommasObj)) {
        //     if (Object.keys(withoutCommasObj).length > 0) {
        //         body.query	= body.query.replace("condition:", 'first: 10, offset: 0, condition: '+this.append_values(withoutCommasObj, numerics, undefined))
        //         has_condition = true
        //     }
        // }
    //     console.log("--- array_keys ---")
    //     console.log(array_keys)
    //     let filter_obj = this.buildWithCommasObject(req?.query, array_keys?.withCommas, numerics)
    //     console.log("----- buildWithCommasObject ------")
    //     console.log(filter_obj)
    //     console.log(inqualities.withInequalities)
    //     // inqualities.withInequalities = this.buildWithCommasObject(inqualities.withInequalities, numerics)
    //     if (filter_obj !== undefined || inqualities.withInequalities !== undefined) {
    //         if (Object.keys(filter_obj).length > 0 || Object.keys(inqualities.withInequalities).length > 0) {
    //             let prepend = ((!has_condition) ? "first: 10, offset: 0, ":"")+'filter: '+this.append_values(filter_obj, numerics, inqualities)+", "
    //             body.query = body.query.replace(/condition:/, prepend+"$&");
    //             has_filter = true
    //             if (Object.keys(numerics).length == 0) {
    //                 body.query	= body.query.replace(", condition:", "")
    //             }
    //         }
    //     }
    //     if (!has_condition) {
    //         body.query	= body.query.replace("condition:", ((has_filter) ? "" : "first: 10, offset: 0"))
    //     }
    //     return body
    // }
    // buildWithCommasObject(obj, withCommasKeys, numerics) {
    //     try {
    //         if (!obj || !Array.isArray(withCommasKeys)) {
    //             return undefined;
    //         }

    //         return withCommasKeys.reduce((acc, key) => {
    //             const value = obj[key];
    //         console.log(obj[key])
    //             // If the value isn't a string, treat it as an error
    //             if (typeof value !== "string" && !Array.isArray(obj[key])) {
    //                 throw new Error(`Invalid value for key "${key}"`);
    //             }
    //             // Split values and trim
    //             let values = []
    //             if (typeof value == "string") {
    //                 values = value.split(",").map(s => s.trim());
    //             } else {
    //                 values = obj[key]
    //             }

    //             // Convert to numbers if key is in numerics
    //             if (Array.isArray(numerics) && numerics.includes(key)) {
    //                 values = values.map(v => {
    //                 const num = Number(v);
    //                 if (isNaN(num)) {
    //                     throw new Error(`Invalid numeric value "${v}" for key "${key}"`);
    //                 }
    //                 return num;
    //             });
    //         }

    //         acc[key] = { in: values };
    //         return acc;
    //         }, {});
    //     } catch (err) {
    //         console.error("Error building withCommas object:", err.message);
    //         return undefined;
    //     }
    // }

    // append_values(obj, numerics, inqualities) {
    //     console.log("----- APPEND VALUES ------")
    //     console.log(obj)
    //     console.log(inqualities)
    //     // let values = []
    //     inqualities = (inqualities === undefined) ? [] : inqualities
    //     numerics = (this.notnull(numerics)) ? numerics : []
    //     let values = this.append_values_algo(obj, numerics, inqualities)
    //     // let values2 = this.append_values_algo(inqualities.withInequalities, numerics, inqualities)
    //     console.log("--- FINISHED APPEND ---")
    //     console.log(values)
    //     if (values.length) {
    //         return "{"+values.join(", ")+"}"
    //     }
    //     return ""
    // }
    // append_values_algo(obj, numerics, inqualities) {
    //     let values = []
    //     console.log("-------------- append_values_algo")
    //     console.log(obj)
    //     console.log(inqualities)
    //     if (inqualities?.withInequalities !== undefined) {
    //         obj = { ...obj, ...inqualities?.withInequalities };
    //     }
    //     if (this.notnull(obj)) {
    //         if (obj?.version) {
    //             delete obj.version
    //         }
    //         if (Array.isArray(obj)) {
    //             return JSON.stringify(obj)
    //         }
    //         Object.keys(obj).map((k, i) => {
    //             console.log(k)
    //             console.log(obj[k])
    //             console.log(i)
    //             if (typeof obj[k] === 'object') {
    //                 let str = k+':'+this.append_values(obj[k], numerics, inqualities)
    //                 return values.push(str)
    //             } else {
    //                 if (Array.isArray(obj[k])) {
    //                     return ""
    //                 }
    //                 let str = ""
    //                 if(k === "num") {
    //                     str = 'l:'+((!isNaN(obj[k])) ? obj[k]: '"'+obj[k]+'"')
    //                 } else {
    //                     // str = k+':'+((!isNaN(obj[k])) ? obj[k]: '"'+obj[k]+'"')
    //                     console.log("---------- EDIT FILTER ", k)
    //                     console.log(Object.keys(inqualities?.withInequalities))
    //                     console.log(Object.keys(inqualities?.withInequalities).includes(k))
    //                     if (Object.keys(inqualities?.withInequalities).includes(k)) {
    //                         if (numerics.includes(k)) {
    //                             str = k+': '+ '{in: '+obj[k]+'}'
    //                         } else {
    //                             str = k+': '+ '{in: "'+obj[k]+'"}'
    //                         }
    //                     } else {
    //                          if (numerics.includes(k)) {
    //                             str = k+': '+ obj[k]
    //                         } else {
    //                             str = k+': '+ '"'+obj[k]+'"'
    //                         }
    //                     }
    //                 }
    //                 if(str.trim() !== "") {
    //                     return values.push(str)
    //                 }
    //             }
    //             return 
    //         })
    //     }
    //     return values
    // }
    extractAndSplitOperators(obj) {
        const keysWithOperators = {};
        const clean = {};
        const withInequalities = {};

        const operatorMap = {
            "<": "lessThan",
            "<=": "lessThanOrEqual",
            "lt": "lessThan",
            ">": "greaterThan",
            ">=": "greaterThanOrEqual",
            "gt": "greaterThan"
        };

        const operatorPattern = /^(<=|>=|<|>|lt|gt)\s*/i;

        for (const key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

            const value = obj[key];

            if (typeof value === "string" && operatorPattern.test(value)) {
                // Single string with operator
                const match = value.match(operatorPattern)[1].toLowerCase();
                keysWithOperators[key] = [operatorMap[match]];

                const cleanedValue = value.replace(operatorPattern, "").trim();
                withInequalities[key] = [cleanedValue];
            } else if (Array.isArray(value)) {
                // Array of values with potential operators
                keysWithOperators[key] = [];
                withInequalities[key] = [];

                value.forEach(v => {
                    if (operatorPattern.test(v)) {
                        const match = v.match(operatorPattern)[1].toLowerCase();
                        keysWithOperators[key].push(operatorMap[match]);
                        withInequalities[key].push(v.replace(operatorPattern, "").trim());
                    } else {
                        // Keep in clean if it's not an operator expression
                        if (!clean[key]) clean[key] = [];
                        clean[key].push(v);
                    }
                });
            } else {
                // Plain value (no operator)
                clean[key] = value;
            }
        }

        const keys = this.normalizeOperatorPairs(keysWithOperators);
        return { keys, clean, withInequalities };
    }

    normalizeOperatorPairs(obj) {
        const updated = {};
        for (const key of Object.keys(obj)) {
            updated[key] = this.ensureOperatorPair(obj[key]);
        }
        return updated;
    }

    ensureOperatorPair(ops) {
        if (!Array.isArray(ops)) return ops;

        const opposites = {
            greaterThan: "lesserThan",
            greaterThanOrEqual: "lesserThanOrEqual",
            lesserThan: "greaterThan",
            lesserThanOrEqual: "greaterThanOrEqual"
        };

        const result = [...ops];
        for (const op of ops) {
            const opposite = opposites[op];
            if (opposite && !result.includes(opposite)) {
                result.push(opposite);
            }
        }
        return result;
    }

}

module.exports = ApiAccess