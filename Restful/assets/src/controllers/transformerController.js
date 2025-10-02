function transform(input) {
  const output = {};

  // Rating → rating-primary
  if (input.Rating !== undefined) {
    output["rating-primary"] = input.Rating;
  }

  // Copy all keys from request directly into output (lowercased)
  if (input.request && typeof input.request === "object") {
    for (const [k, v] of Object.entries(input.request)) {
      output[k.toLowerCase()] = v;
    }
  }

  // Map ABF fields (keys converted to lowercase)
  if (input.abf) {
    const abf = {};
    for (const [k, v] of Object.entries(input.abf)) {
      abf[k.toLowerCase()] = v;
    }

    if (abf.quoteid) output.quote_id = abf.quoteid;
    if (abf.charge) output.cost = abf.charge;
    if (abf.advertisedtransit) output.transit = abf.advertisedtransit;
    if (abf.shipdate) output.shipping = abf.shipdate;
    if (abf.effectivedate) output.effective = abf.effectivedate;
    if (abf.expirationdate) output.expires = abf.expirationdate;

    // Pickup info
    if (abf.origterminfo) {
      output.pickup = {
        city: abf.origterminfo.origtermcity,
        state: abf.origterminfo.origtermstate,
        zip: abf.origterminfo.origtermzip,
      };
    }

    // Dropoff info
    if (abf.destterminfo) {
      output.dropoff = {
        city: abf.destterminfo.desttermcity,
        state: abf.destterminfo.desttermstate,
        zip: abf.destterminfo.desttermzip,
      };
    }
  }

  return output;
}
function mod_quote(input) {
    const totals = {
        total_number: 0,
        total_length: 0,
        total_width: 0,
        total_height: 0,
        total_weight: 0
    };

    if (Array.isArray(input.items)) {
        for (const item of input.items) {
            totals.total_number += item.number || 0;
            totals.total_length += item.length || 0;
            totals.total_width += item.width || 0;
            totals.total_height += item.height || 0;
            totals.total_weight += item.weight || 0;
        }
    }

    return { ...input, ...totals };
}
module.exports = { transform, mod_quote }