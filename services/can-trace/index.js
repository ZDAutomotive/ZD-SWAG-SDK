import ioClient from 'socket.io-client';
import axios from 'axios';

export default class CANTrace {
  constructor(option) {
    option = option || {}
    // this.port = option.port || 6002;
    this.name = option.name || 'can-trace'
    this.host = option.host || 'localhost'
    this.subscribeMap = {}
  }

  connect(type) {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}/`, {
        path: `/api/${this.name}/socket.io`
      });
      this.socket.on('connect', () => {
        resolve(1)
        if (type) this.socket.emit('identity', type)
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
      })
      this.socket.on('connect_error', () => {
        reject(1)
        if(this.socket) {
          this.socket.removeAllListeners('connect')
          this.socket.removeAllListeners('connect_error')
          this.socket.close()
          delete this.socket
        }
      })
    })
  }

  /**
   * send a single canmsg
   */
  async sendCANMsg(name, canmsg) {
    let res = await axios.post(`http://${this.host}/api/${this.name}/send`, {
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
    await axios.post(`http://${this.host}/api/${this.name}/send/multi`, canmsgs)

    return true
  }
}
