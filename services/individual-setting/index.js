import ioClient from 'socket.io-client';
import axios from 'axios';

export default class carSetting {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6099;
    this.host = option.host || 'localhost'
  }

  /**
   * @deprecated
   */
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
   * set driver side temprature 
   * value range 18 - 26
   */
  async setTemperature(value) {
    let res = await axios.post(`http://${this.host}:${this.port}/carservice/ac/temprature`, {
      temprature: value
    })
    return res.data;
  }

  /**
   * active interior light profile 
   * number 1-9
   */
  async activeInteriorlightProfile(profileNumber) {
    let res = await axios.post(`http://${this.host}:${this.port}/carservice/interiorlight/profile`, {
      profileNumber
    })
    return res.data
  }
}
