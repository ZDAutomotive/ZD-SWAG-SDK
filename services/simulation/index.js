import ioClient from 'socket.io-client';
import axios from 'axios';

export default class Simulation {
    constructor(option) {
        this.port = option.port || 6006;
        this.host = option.host || 'localhost'
        this.subscribeMap = {}
    }
    connect() {
        return new Promise((resolve, reject) => {
          this.socket = ioClient.connect(`http://${this.host}:${this.port}/`);
          this.socket.on('connect', () => {
            resolve(1)
            this.socket.emit('identity', 'remote')
            this.socket.removeAllListeners('connect')
            this.socket.removeAllListeners('connect_error')
          })
          this.socket.on('connect_error', () => {
            reject(1)
            this.socket.removeAllListeners('connect')
            this.socket.removeAllListeners('connect_error')
            delete this.socket
          })
        })
    }
    /**
    * call remotePanel
    */
    //keyevent {keyid:, keyboardid:}
    async keyReq(keyevent) {
        if (!this.socket) throw new Error('Service not ready')
            let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/key`, keyevent)
        return res.data;
    }
    //touchevent {x:, y:}
    async touchReq(touchevent) {
        if (!this.socket) throw new Error('Service not ready')
            let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/touch`, touchevent)
        return res.data;
    }
    //dragevent {x:, y:, dx:, dy:}
    async dragReq(dragevent) {
        if (!this.socket) throw new Error('Service not ready')
            let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/drag`, dragevent)
        return res.data;
    }
    //touchscreenshot {x:0, y:0}
    async touchscreenshotReq(ssevent) {
        if (!this.socket) throw new Error('Service not ready')
            let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/touchscreenshot`, ssevent)
        return res.data;
    }
      
    
}