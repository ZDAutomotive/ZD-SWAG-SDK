const Event = require('event');
const ioClient = require('socket.io-client');

function addEventHandlers(socket, emitter) {
    if (!socket) return;

    socket.on('probe_status', message=>{
        emitter.emit('probe_status', message);
    });
    socket.on('event', message=>{
        emitter.emit('event', message);
    });
    socket.on('command_result', message=>{
        emitter.emit('command_result', message);
    });
    socket.on('unknown', message=>{
        emitter.emit('unknown', message);
    });
}

class AdroidProberProxy {
    constructor(option) {
        this.emitter = new Event();
        this.option = option;
        this.socket = null;
    }

    listen() {
        return this.emitter;
    }

    connect() {
        this.socket = ioClient.connect(`http://${this.option.host}:${this.option.port}/socket`);
        addEventHandlers(this.socket, this.emitter);

        this.socket.on('connect', async () => {
            console.log(`Connected to ZD-SWAG-AndroidProberProxy Service on: ${this.option.host}:${this.option.port}`);
        });

        this.socket.on('reconnect', attemptNumber => {
            console.log(`Connected to ZD-SWAG-AndroidProberProxy Service on: ${this.option.host}:${this.option.port}, after ${attemptNumber} times attemptions`);
        });

        this.socket.on('disconnect', reason => {
            console.log(`Disonnected to ZD-SWAG-AndroidProberProxy Service on: ${this.option.host}:${this.option.port}, reason:`, reason);
        });

        this.socket.on('error', function (err) {
            console.log(err);
        });
    }

    start() {

    }

    stop() {
        
    }
}