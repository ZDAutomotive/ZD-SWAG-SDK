const Event = require('events');
const axios = require("axios");

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
    }

    listen() {
        return this.emitter;
    }

    connect(option, cb) {
        axios
            .post(`http://${this.option.host}:${this.option.port}/leopaard/tbox-simulator/connect`, {
                hostname: option.hostname, port: option.port
            })
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
}

class TspSimulator {
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
                cb(false, res);
            })
            .catch(err => {
                cb(true, err);
            });
    }
}

module.exports = {
    Executor: Executor,
    TboxSimulator: TboxSimulator,
    TspSimulator: TspSimulator,
}