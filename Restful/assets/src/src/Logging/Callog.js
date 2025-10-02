
// FUNCTIONALITY
class Callog {
    constructor({n, c}) {
        this.colors     = { FgBlack: "\x1b[30m",
                            FgRed: "\x1b[31m",
                            FgGreen: "\x1b[32m",
                            FgYellow: "\x1b[33m",
                            FgBlue: "\x1b[34m",
                            FgMagenta: "\x1b[35m",
                            FgCyan: "\x1b[36m",
                            FgWhite: "\x1b[37m",
                            BgBlack: "\x1b[40m",
                            BgRed: "\x1b[41m",
                            BgGreen: "\x1b[42m",
                            BgYellow: "\x1b[43m",
                            BgBlue: "\x1b[44m",
                            BgMagenta: "\x1b[45m",
                            BgCyan: "\x1b[46m",
                            BgWhite: "\x1b[47m",
                            Reset: "\x1b[0m",
                            Underscore : "\x1b[4m"}
        this.id         = Math.floor(1000 + Math.random() * 9000);
        this.history    = {}
        this.#assignCalling({n: n, c: c})
    }
    getIdLabel() {
        return this.colors.FgRed +" [ " + this.id+ " ] "+this.colors.Reset
    }
    from() {
        return this.callingFrom
    }
    time() {
        var expended = ""
        if (this.history[Object.keys(this.history).length-1] !== undefined) {
            expended = this.#getSpacing({data: this.timestamp, spacing: 20})+"( " + ((this.timestamp - Object.values(this.history[Object.keys(this.history).length-1])[0]) / 1000)+ "ms )"
        }
        return this.colors.FgRed +" [ " + this.id+ " ] "+this.colors.Reset+
                this.colors.FgYellow+this.name +this.#getSpacing({data: this.name})+this.colors.Reset
                + "PERFORMED     "+
                this.colors.FgGreen+this.timestamp+ expended +this.#getSpacing({data: (this.timestamp + expended)})+this.colors.Reset+
                " FROM     " + 
                this.colors.FgYellow+this.callingFrom+this.colors.Reset
    }
    #getSpacing({data, spacing}) {
        let spaces = (spacing === undefined) ? 40 : spacing
        let offset = (data === undefined) ? '' : data.toString()
        return (Array(spaces - offset.length).fill(' ')).join('')
    }
    update({n, c}) {
        var historyObject = {[this.callingFrom]: this.timestamp}
        this.history[Object.keys(this.history).length] = historyObject
        this.#assignCalling({n: n, c: c})
        return this
    }
    // Update with Name/Time Reassignment
    uwt({n, c}) {
        var returnString = this.name + " executed at " +this.timestamp
        this.update({n: n, c: c})
        return this
    }
    #assignCalling({n, c}) {
        this.name           = (n === undefined) ? c : n
        this.callingFrom    = c
        var loadTimeInMS    = Date.now()
        var performanceNow  = require("performance-now")
        this.timestamp      = (loadTimeInMS + performanceNow()) * 1000
    }
    getHistory() {
        return this.history
    }
}
module.exports = {
    Callog
}