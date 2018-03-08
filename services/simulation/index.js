const ioClient = require ('socket.io-client')
const axios = require('axios')

module.exports = class RemotepanelClient {
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
            reject(0)
            this.socket.removeAllListeners('connect')
            this.socket.removeAllListeners('connect_error')
            delete this.socket
          })
        })
    }
    /**
    * call remotePanel
    */
    //keyevent {keyid:'ZD_SDS', keyboardid:1}
    async keyReq(keyevent) {
        if (!this.socket) throw new Error('Service not ready')
            let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/key`, keyevent)
        return res.data;
    }
    //touchevent {screentype: 1(top) / 2(bottom), x:, y:}
    async touchReq(touchevent) {
        if (!this.socket) throw new Error('Service not ready')
            let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/touch`, touchevent)
        return res.data;
    }
    //dragevent {screentype: 1(top) / 2(bottom), x:, y:, dx:, dy:}
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