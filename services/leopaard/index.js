const Event = require('events');
const axios = require("axios");

module.exports = class Leopaard {
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
