const fvCodec = require('./codec/fv-codec.js')
const evCodec = require('./codec/ev-codec.js')

module.exports.parse = function (data, context) {
    if (data.readUInt16BE(0) == 11822) {
        return fvCodec.parse(data, context)
    } else if (data.readUInt16BE(0) == 8995) {
        return evCodec.parse(data, context)
    } else {
        console.log('unrecognized message:', data)
        return null
    }
}

module.exports.encode = function (message) {
    let data = null
    if (message.startDelimiter == 11822) {
        data = fvCodec.encode(message)
    } else if (message.startDelimiter == 8995) {
        data = evCodec.encode(message)
    } else {
        console.log('unrecognized message:', message)
        return null
    }
    return data
}