// REQUEST IMPORT
const ApiAccess = require("../src/General/access_api.js");
const { get_distance }      = require("./distanceController.js");
const { notnull }           = require("../src/General/support_funcs.js")
const api = new ApiAccess();

// exports.class = async (req, res, next) => {
//     return determine_class({density: req.body.density});
// }

function determine_class({density}) {
    if (density > 50) { return 50 }
    if (density < 50 && density >= 35) { return 55 }
    if (density < 35 && density >= 30) { return 60 }
    if (density < 30 && density >= 22.5) { return 65 }
    if (density < 22.5 && density >= 15) { return 70 }
    if (density < 15 && density >= 13.5 ) { return 77.5 }
    if (density < 13.5 && density >= 12) { return 85 }
    if (density < 12 && density >= 10.5) { return 92.5 }
    if (density < 10.5 && density >= 9) { return 100 }
    if (density < 9 && density >= 8) { return 110 }
    if (density < 8 && density >= 7) { return 125 }
    if (density < 7 && density >= 6) { return 150 }
    if (density < 6 && density >= 5) { return 175 }
    if (density < 5 && density >= 4) { return 200 }
    if (density < 4 && density >= 3) { return 250 }
    if (density < 3 && density >= 2) { return 300 }
    if (density < 2 && density >= 1) { return 400 }
    if (density < 1) { return 500 }
    return 500
}
function expose_class(req, res, next)  {
    res.send({class: calculate_class(req)})
}
function calculate_class(req)  {
    let density = req?.query?.density
    let volume = req?.query?.volume
    let weight = req?.query?.weight
    let height = req?.query?.height
    let width = req?.query?.width
    let length = req?.query?.length
    let radius = req?.query?.radius
    let shape = (req?.query?.shape === undefined)  ? "cube" : req?.query?.shape
    if (!notnull(volume) && (notnull(height) && notnull(width) && notnull(length))) {
        if (shape === "cube") {
            volume = height * width * length
        }
    }
    if (shape === "cylinder" || notnull(radius)) {
        if (!notnull(radius) && ((notnull(width) || notnull(length)))) {
            if (notnull(width)) {
                radius = width / 2
            }
            if (notnull(length)) {
                radius = length / 2
            }
        }
        volume = Math.PI * Math.pow(radius, 2) * height;
    }
    let system = "imperial"
    // Finish improving later when we fully integrate metric toggles
    let cubic_volume = 1728
    let measurment_type = (notnull(req?.query?.measurment_type)) ? req?.query?.measurment_type : "ft"
    if (measurment_type === "ft" || measurment_type === "m") {
        if (system === "imperial") {
            cubic_volume = 1
        }
    }
    if (system !== "imperial") {
        cubic_volume = 1000000000
    }
    if (notnull(weight) && notnull(volume)) {
        if (!notnull(density)) {
            density = weight / ((volume) / cubic_volume)
        }
    }
    return determine_class({density: density})
    // res.send({class: determine_class({density: density})})
}
module.exports = { determine_class, expose_class, calculate_class }