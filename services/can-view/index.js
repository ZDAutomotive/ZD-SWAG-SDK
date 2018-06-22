import ioClient from 'socket.io-client';
import axios from 'axios';

export default class CANView {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6010;
    this.host = option.host || 'localhost'
    this.subscribeMap = {}
  }

  connect(type) {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}:${this.port}/`);
      this.socket.on('connect', () => {
        resolve(1)
        if (type) this.socket.emit('identity', type)
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

  async initCANBC(fileName) {
    if (!this.socket) throw new Error('CAN Trace service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/canbc`, {
      fileName
    })
    return res.data;
  }

  async getCANBC() {
    if (!this.socket) throw new Error('CAN Trace service not ready')
    let res = await axios.get(`http://${this.host}:${this.port}/canbc`)
    return res.data;
  }

  async deleteCANBC() {
    if (!this.socket) throw new Error('CAN Trace service not ready')
    let res = await axios.delete(`http://${this.host}:${this.port}/canbc`)
    return res.data;
  }

  /**
   * parse a single canmsg
   */
  async parse(canmsg) {
    if (!this.socket) throw new Error('CAN Trace service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/canbc/parse`, canmsg)
    return res.data;
  }
}
