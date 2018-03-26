const Event = require('events');
const axios = require("axios");
const ioClient = require('socket.io-client');

var g_socket = null

class Executor {
    constructor(option) {
        this.emitter = new Event();
        this.option = option;
    }

    listen() {
        return this.emitter;
    }

    run(script, cb) {
        axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/executor/run`, {
                script
            })
            .then(res => {
                cb(false, res.data);
            })
            .catch(err => {
                cb(true, err);
            });
    }
}

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
        g_socket = ioClient(`http://${this.option.host}:${this.option.port}/`)
        g_socket.on('connect', () => {
            console.log('Socket.IO available now')
        })
    }

    newExecutor() {
        return new Executor(this.option)
    }
    newTboxSimulator() {
        return new TboxSimulator(this.option)
    }
    newTspSimulator() {
        return new TspSimulator(this.option)
    }
}

// module.exports = {
//     Executor Executor,
//     TboxSimulator: TboxSimulator,
//     TspSimulator: TspSimulator,
// }