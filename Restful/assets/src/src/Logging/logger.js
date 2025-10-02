// MODULE IMPORTS
const log4js    = require("log4js");
const configs   = require('../../configs.json');

// LOGGING
const {Callog}  = require('./Callog.js')

// FUNCTIONALITY
function getLogger() {
    log4js.configure({
        appenders: { console: { type: 'console' } },
        categories: { default: { appenders: [ 'console' ], level: 'info' } }
    });
    var logger = log4js.getLogger();
    logger.level = (configs.logLevel !== undefined) ? configs.logLevel : "warn";
    return logger
}
function getCallog({n, c, callog}) {
    if (callog !== undefined) {
        return callog.uwt({n: n, c: c})
    }
    return new Callog({n: n, c: c})
}
function newCallog({n, c}) {
    return new Callog({n: n, c: c})
}
function callogTime(callog) {
    if (callog !== undefined) {
        log4js.getLogger().trace(callog.time())
    }
}
function performTrace(callog) {
    if (callog !== undefined) {
        var history = callog.getHistory()
        log4js.getLogger().trace(callog.colors.FgRed+" Callog History Dump :"+callog.colors.Reset)
        Object.keys(history).forEach((item, index) => {
            log4js.getLogger().trace(callog.getIdLabel() + " " +item + " > " + JSON.stringify(Object.values(history)[index]))
        })
    }
}

module.exports = {
    getLogger,
    getCallog,
    newCallog,
    callogTime,
    performTrace
}