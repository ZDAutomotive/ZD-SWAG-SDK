import ioClient from 'socket.io-client';
import axios from 'axios';

export default class seatControl {
  constructor(option) {
    option = option || {}
    // this.port = option.port || 6098;
    this.name = option.name || 'seat-adjustment'
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
   * set seat position 
   * value range 
    slv- de(32297-32837) cn(32239-32768)
    lnv- de(32331-33467) cn(32068-33209)
    shv- de(32635-33132) cn(32569-33087)
    snv- de(32607-32878) cn(32547-32811)
   */
  async setPosition(value) {
    if (!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}/api/${this.name}/setposition`, {
      position: value
    })
    return res.data;
  }

  /**
   * set seat position range 
   * value range 
    slv- de(32297-32837) cn(32239-32768) cn2 (32262-32802)
    lnv- de(32331-33467) cn(32068-33209) cn2 (32288-33346)
    shv- de(32635-33132) cn(32569-33087) cn2 (32359-32845)
    snv- de(32607-32878) cn(32547-32811) cn2 (32599-32859)
    minimum = [32262,32288,32359,32599],
    maximum = [32802,33346,32845,32859]
   */
  async setRange(minimum,maximum) {
    if (!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}/api/${this.name}/setrange`, {
      min: minimum,
      max: maximum
    })
    return res.data;
  }

  /**
   * reset the seat position
   */
  async resetPosition() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}/api/${this.name}/resetposition`, {})
    return res.data
  }

  /**
   * get the seat adjustment range
   */
  async getRange() {
    if (!this.socket) throw new Error('Seat Control service not ready')
    const res = await axios.get(`http://${this.host}/api/${this.name}/getrange/`)

    return res.data
  }

  /**
   * get the seat measured position
   */
  async getPosition() {
    if (!this.socket) throw new Error('Seat Control service not ready')
    const res = await axios.get(`http://${this.host}/api/${this.name}/status/`)

    return res.data
  }


  
}


