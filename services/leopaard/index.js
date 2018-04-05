const Event = require('events');
const axios = require("axios");
const ioClient = require('socket.io-client');

var g_socket = null

class TboxSimulator {
    constructor(option) {
        this.emitter = new Event();
        this.option = option;
        g_socket.on('TBOX-RECV', (message) => {
            this.emitter.emit('message', message)
        })
    }

    listen() {
        return this.emitter;
    }

    connect(option, cb) {
        axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tbox-simulator/connect`, option)
            .then(res => {
                cb(false, res.data);
            })
            .catch(err => {
                cb(true, err);
            });
    }
    disconnect(cb) {
        axios
            .get(`http://${this.option.host}:${this.option.port}/leopaard/tbox-simulator/disconnect`)
            .then(res => {
                cb(false, res.data);
            })
            .catch(err => {
                cb(true, err);
            });
    }
    send(message, cb) {
        axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tbox-simulator/send`, { message })
            .then(res => {
                cb(false, res.data);
            })
            .catch(err => {
                cb(true, err);
            });
    }
}

class TspSimulator {
    constructor(option) {
        this.emitter = new Event();
        this.option = option;
        g_socket.on('TSP-RECV', (message) => {
            this.emitter.emit('message', message)
        })
    }

    listen() {
        return this.emitter;
    }

    start(option, cb) {
        axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tsp-simulator/start`, option)
            .then(res => {
                cb(false, res);
            })
            .catch(err => {
                cb(true, err);
            });
    }
    stop(cb) {
        axios
            .get(`http://${this.option.host}:${this.option.port}/leopaard/tsp-simulator/stop`)
            .then(res => {
                cb(false, res.data);
            })
            .catch(err => {
                cb(true, err);
            });
    }
    send(message, cb) {
        axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tsp-simulator/send`, { message })
            .then(res => {
                cb(false, res.body);
            })
            .catch(err => {
                cb(true, err);
            });
    }
}

module.exports = class {
    constructor(option) {
        this.option = option
        if (!g_socket) {
            g_socket = ioClient(`http://${this.option.host}:${this.option.port}/`)
            g_socket.on('connect', () => {
                console.log('Leopaard Service available')
            })
            .on('close',()=>{
                console.log('Leopaard Service unavailable')
                g_socket.removeAllListener()
            })
        }
    }

    newTboxSimulator() {
        return new TboxSimulator(this.option)
    }
    newTspSimulator() {
        return new TspSimulator(this.option)
    }
}

// module.exports = {
//     TboxSimulator: TboxSimulator,
//     TspSimulator: TspSimulator,
// }