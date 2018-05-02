const axios = require("axios")
const Event = require('events')

const codec = require('../../lib/leopaard/codec.js')

module.exports = class TspSimulator {
    constructor(option) {
        this.option = option;
        this.emitter = new Event();

        this.emitter.on('PARSED', message => {
            this.emitter.emit('message', message)
        })

        this.option.socket.on('TSP-RECV', (message) => {
            codec.parse(message, { emitter: this.emitter })
        })
    }

    listen() {
        return this.emitter;
    }

    start(option) {
        return axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tsp-simulator/start`, option)

    }

    stop() {
        return axios
            .get(`http://${this.option.host}:${this.option.port}/leopaard/tsp-simulator/stop`)
    }

    send(data) {
        let message = codec.encode(data)
        return axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tsp-simulator/send`, { message })
    }
}
