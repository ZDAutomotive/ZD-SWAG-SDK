import ioClient from 'socket.io-client';
import axios from 'axios';

export default class CANTrace {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6002;
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
   * send a single canmsg
   */
  async sendCANMsg(name, canmsg) {
    if (!this.socket) throw new Error('CAN Trace service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/send`, {
      name,
      canmsg
    })
    return res.data;
  }

  /**
   * send a group of canmsg in a time sequence
   * @param {Object[]} canmsgs a group of canmsg
   */
  async sendMultiCANMsgs(canmsgs) {
    if (!this.socket) throw new Error('CAN Trace service not ready')
    await axios.post(`http://${this.host}:${this.port}/send/multi`, canmsgs)

    return true
  }
}
