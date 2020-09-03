import ioClient from 'socket.io-client';
import axios from 'axios';

export default class POWERSwitch {
  constructor(option) {
    // this.port = option.port || 6007;
    this.name = option.name || 'power-switch'
    this.host = option.host || 'localhost'
  }

  connect(type) {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}/`, {
        path: `/api/${this.name}/socket.io`
      });
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
    await axios.post(`http://${this.host}/api/${this.name}/poweron`)
    return true;
  }

  /**
   * poweroff
   */
  async powerOff() {
    await axios.post(`http://${this.host}/api/${this.name}/poweroff`)
    return true
  }
  /**
   * selectdevice
   */
  async selectDevice(addr) {
    await axios.post(`http://${this.host}/api/${this.name}/selectdevice`, {addr});
    return true
  }
  /**
   * readcurrent
   */
  async readCurrent(){
    let res = await axios.get(`http://${this.host}/api/${this.name}/readcurrent`)
    return res.data
  }
  /**
   * usbconnect
   */
  async usbConnect() {
    await axios.post(`http://${this.host}/api/${this.name}/usbconnect`)
    return true;
  }
  /**
   * usbdisconnect
   */
  async usbDisconnect() {
    await axios.post(`http://${this.host}/api/${this.name}/usbdisconnect`)
    return true;
  }
}
