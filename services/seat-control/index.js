import ioClient from 'socket.io-client';
import axios from 'axios';

export default class seatControl {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6098;
    this.host = option.host || 'localhost'
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
   * set seat position 
   * value range 
    slv- de(32297-32837) cn(32239-32768)
    lnv- de(32331-33467) cn(32068-33209)
    shv- de(32635-33132) cn(32569-33087)
    snv- de(32607-32878) cn(32547-32811)
   */
  async setPosition(value) {
    if (!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/setposition`, {
      position: value
    })
    return res.data;
  }

  /**
   * reset the seat position
   */
  async resetPosition() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/resetposition`, {})
    return res.data
  }
}
