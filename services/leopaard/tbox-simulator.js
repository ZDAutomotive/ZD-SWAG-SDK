const axios = require("axios")
const Event = require('events')

const codec = require('../../lib/leopaard/codec.js')

module.exports = class TboxSimulator {
    constructor(option) {
        this.option = option;
        this.emitter = new Event();

        this.emitter.on('PARSED', message => {
            this.emitter.emit('message', message)
        })

        this.option.socket.on('TBOX-RECV', (message) => {
            codec.parse(message, { emitter: this.emitter })
        })
    }

    listen() {
        return this.emitter;
    }

    connect(option) {
        return axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tbox-simulator/connect`, option)
    }

    disconnect() {
        return axios
            .get(`http://${this.option.host}:${this.option.port}/leopaard/tbox-simulator/disconnect`)
    }

    send(data) {
        let message = codec.encode(data)
        return axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tbox-simulator/send`, { message })
    }
}
