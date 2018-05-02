const path = require('path')
const fs = require('fs')
const readline = require('readline')
const EventEmitter = require('events')

const fvParser = require('./codec/fv-tsp-tbox-protocol-parser.js')
const evParser = require('./codec/ev-tsp-tbox-protocol-parser.js')

const emitter = new EventEmitter()

module.exports.startFVParse = function (logFile) {
    parse(logFile, /2e2e[0-9a-f]*/i)
    emitter.on('line', buffer=>{
        emitter.emit('PARSED', fvParser.parse(buffer))
    })
}

module.exports.startEVParse = function (logFile) {
    parse(logFile, /2323[0-9a-f]*/i)
    emitter.on('line', buffer=>{
        emitter.emit('PARSED', evParser.parse(buffer));
    })
}

module.exports.listen = function () {
    return emitter
}

function parse(logFile, rule) {
    const rl = readline.createInterface({
        input: fs.createReadStream(logFile)
    })
    rl.on('line', (line) => {
        let logContent = line.match(rule)
        if (logContent) {
            //console.log(logContent[0])
            let buffer = Buffer.from(logContent[0], 'hex')
            emitter.emit('line', buffer)
        }
    })
    rl.on('close', () => {
        //console.log('parse done!')
        emitter.emit('DONE')
        emitter.removeAllListeners()
    })
}

