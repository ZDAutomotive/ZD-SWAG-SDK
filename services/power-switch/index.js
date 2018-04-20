import ioClient from 'socket.io-client';
import axios from 'axios';

export default class POWERSwitch {
  constructor(option) {
    this.port = option.port || 6007;
    this.host = option.host || 'localhost'
    this.subscribeMap = {}
  }

  connect(type) {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}:${this.port}/`);
      this.socket.on('connect', () => {
        resolve(1)
        this.socket.emit('identity', type)
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
   * poweron
   */
  async powerOn() {
    if (!this.socket) throw new Error('Power Switch service not ready')
    await axios.post(`http://${this.host}:${this.port}/poweron`)
    return true;
  }

  /**
   * poweroff
   */
  async powerOff() {
    if (!this.socket) throw new Error('Power Switch service not ready')
    await axios.post(`http://${this.host}:${this.port}/poweroff`)
    return true
  }
  /**
   * selectdevice
   */
  async selectDevice(addr) {
    if (!this.socket) throw new Error('Power Switch service not ready')
    await axios.post(`http://${this.host}:${this.port}/selectdevice`, {addr});
    return true
  }
  /**
   * readcurrent
   */
  async readCurrent(){
    if(!this.socket) throw new Error('Current monitoring service not ready')
    let res = await axios.get(`http://${this.host}:${this.port}/readcurrent`)
    return res.data
  }
  /**
   * usbconnect
   */
  async usbConnect() {
    if (!this.socket) throw new Error('USB Switch service not ready')
    await axios.post(`http://${this.host}:${this.port}/usbconnect`)
    return true;
  }
  /**
   * usbdisconnect
   */
  async usbDisconnect() {
    if (!this.socket) throw new Error('USB Switch service not ready')
    await axios.post(`http://${this.host}:${this.port}/usbdisconnect`)
    return true;
  }
}
