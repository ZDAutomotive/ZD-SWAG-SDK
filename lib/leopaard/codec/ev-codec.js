const parser = require('./ev-tsp-tbox-protocol-parser.js')
const encoder = require('./ev-tsp-tbox-protocol-encoder.js')

const DELIMITER = 0x2323
const HEADER_LENGTH = 25
const LENGTH_OFFSET = 22

var buffer = null

module.exports.parse = function (data, context) {
    if (!buffer)
        buffer = Buffer.from(data)
    else
        buffer = Buffer.concat([buffer, data], buffer.length + data.length)

    while (buffer.length > HEADER_LENGTH) {
        // locates a valid message frame
        let delimiter = buffer.readUInt16BE(0)
        if (delimiter != DELIMITER) {
            buffer = buffer.slice(2)
            //console.log('NO delimiter', delimiter, delimiter != DELIMITER)
            continue
        }

        let dataLength = buffer.readUInt16BE(LENGTH_OFFSET)
        //console.log('dataLength', dataLength)
        if (buffer.length >= HEADER_LENGTH + dataLength) {
            if (buffer.length > HEADER_LENGTH + dataLength && buffer.readUInt16BE(HEADER_LENGTH + dataLength) != DELIMITER) {
                buffer = buffer.slice(2)
                continue
            } else {
                let frame = buffer.slice(0, HEADER_LENGTH + dataLength);
                context.emitter.emit('PARSED', parser.parse(frame))

                buffer = buffer.slice(HEADER_LENGTH + dataLength)
                //return parser.parse(frame)
            }
        }
    }
    return null
}

module.exports.encode = function (message, context) {
    return encoder.encode(message)
}
