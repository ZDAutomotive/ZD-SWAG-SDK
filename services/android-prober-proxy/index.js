const Event = require('events');
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

export default class AdroidProberProxy {
  constructor(option) {
    this.emitter = new Event();
    this.option = option;
    this.socket = null;
  }

  listen() {
    return this.emitter;
  }

  connect() {
    this.socket = ioClient.connect(`http://${this.option.host}/api/android-prober-proxy/socket`);
    addEventHandlers(this.socket, this.emitter);

    this.socket.on('connect', async () => {
      console.log(`Connected to ZD-SWAG-AndroidProberProxy Service on: ${this.option.host}/api/android-prober-proxy`);
    });

    this.socket.on('reconnect', attemptNumber => {
      console.log(`Connected to ZD-SWAG-AndroidProberProxy Service on: ${this.option.host}/api/android-prober-proxy, after ${attemptNumber} times attemptions`);
    });

    this.socket.on('disconnect', reason => {
      console.log(`Disonnected to ZD-SWAG-AndroidProberProxy Service on: ${this.option.host}/api/android-prober-proxy, reason:`, reason);
    });

    this.socket.on('error', (err) => {
      console.log(err);
    });
  }

  start() {

  }

  stop() {
        
  }
}
