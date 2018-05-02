const ioClient = require('socket.io-client')

const TboxSimulator = require('./tbox-simulator.js')
const TspSimulator = require('./tsp-simulator.js')

module.exports = class Leopaard {
    constructor(option) {
        if (!this.ioSocket) {
            this.ioSocket = ioClient(`http://${option.host}:${option.port}/`)
            this.ioSocket
                .on('connect', () => {
                    console.log('Leopaard Service available')
                })
                .on('close', () => {
                    console.log('Leopaard Service unavailable')
                    this.ioSocket.removeAllListener()
                    this.ioSocket = null
                })
        }
        this.option = option
        this.option.socket = this.ioSocket
    }

    finish() {
        if (this.ioSocket)
            this.ioSocket.close()
    }

    newTboxSimulator() {
        return new TboxSimulator(this.option)
    }
    newTspSimulator() {
        return new TspSimulator(this.option)
    }
}