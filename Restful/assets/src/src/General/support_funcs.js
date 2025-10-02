function notnull(input) {
    if (input !== undefined && input !== null) {
        return true
    }
    return false
}
function notblank(input) {
    if (notnull(input) && input !== '') {
	    return true
    }
    return false
}
function isNum(input) {
    if (notnull(input) && !Number.isNaN(input)) {
        return true
    }
    return false
}
function reda(v) {
    if (v !== undefined && typeof v === "object") {
        let args = JSON.parse(JSON.stringify(v))
        Object.keys(args).map((k, i) => {
            if (typeof args[k] === "object") {
                delete args[k]
            }
            if (!notblank(args[k])) {
                delete args[k]
            }
        })
        if (!notnull(args)) {
            return {}
        }
        return args
    }
    return v
}
function keys_with_commas(obj) {
  const result = [];
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === "string" && value.includes(",")) {
        result.push(key);
      }
    }
  }
  
  return result;
}
function keys_by_comma_presence(obj) {
  const withCommas = [];
  const withoutCommas = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if ((typeof value === "string" && value.includes(",")) || Array.isArray(value)) {
        withCommas.push(key);
      } else {
        withoutCommas.push(key);
      }
    }
  }

  return { withCommas, withoutCommas };
}
function objToGraphQLString(obj, numerics = []) {
  function helper(value, key = null) {
    if (Array.isArray(value)) {
      return `[${value.map(v => helper(v, key)).join(", ")}]`;
    } else if (typeof value === "object" && value !== null) {
      return `{ ${Object.entries(value)
        .map(([k, v]) => `${k}: ${helper(v, k)}`)
        .join(", ")} }`;
    } else if (typeof value === "string") {
      // If the current key is in numerics, render as number
      if (key && numerics.includes(key)) {
        return Number(value);
      }
      return `"${value}"`;
    } else {
      return String(value);
    }
  }

  return helper(obj);
}
function chunk(arr) {
  if (Array.isArray(arr)) {
    return chunkArrayIntoPairs(arr)
  }
  return chunkStringIntoPairs(arr)
}
// Split an array into chunks of 2 (strings stay strings)
function chunkArrayIntoPairs(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i += 2) {
    result.push([String(arr[i]), String(arr[i + 1])]);
  }
  return result;
}

// Split a comma-separated string into chunks of 2
function chunkStringIntoPairs(str) {
  if (notnull(str)) {
    const arr = str.split(","); // keep as strings
    return chunkArrayIntoPairs(arr);
  }
  return
}
function comma(next) {
    if (notblank(next)) {
        return ","+next
    }
    return ""
}
async function request({url, details, content_type, method, app_token, custom_headers, token}) {
    method          = (method === undefined) ? "POST" : method
    content_type    = (content_type === undefined) ? 'application/json' : content_type
    details         = (content_type === 'application/x-www-form-urlencoded;charset=UTF-8') ? format_body(details) : details
    app_token       = (app_token === undefined) ? '6b2eb7ed5e1847f9e8c6a8a1e4fee0fb0a5a698dcdabc0bddbce467090de8a2b' : app_token
    let headers = {
        'Content-Type': content_type,
        'Authorization': 'Bearer '+token,
        'X-Forwarded-Application': app_token,
    }
    if(custom_headers !== undefined) {
        headers = {...headers, ...custom_headers}
    }
    let result = await fetch(url, {
        headers: headers,
        // headers: {
        //     'Content-Type': content_type,
        //     'Authorization': 'Bearer '+token,
        //     'X-Forwarded-Application': app_token
        // },
        body: (method === "POST") ? details : undefined,
        method: method
    })
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
function convert_time(value) {
    var hours = Math.floor((value / 60) / 60);
    var minutes = Math.floor((value / 60) - (hours * 60))
    return hours + (minutes/100)
}
function keysToLowerCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(keysToLowerCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = keysToLowerCase(obj[key]);
      return acc;
    }, {});
  }
  return obj; // primitives stay as is
}
function removeUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = removeUndefined(value);
      }
      return acc;
    }, {});
  }
  return obj;
}
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function keysToCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamelCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = toCamelCase(key);
      acc[newKey] = keysToCamelCase(value);
      return acc;
    }, {});
  }
  return obj;
}

module.exports = { notnull, notblank, isNum, reda, keys_with_commas, keys_by_comma_presence, objToGraphQLString, chunkArrayIntoPairs, chunkStringIntoPairs, comma, request, convert_time, chunk, keysToLowerCase, removeUndefined, keysToCamelCase}