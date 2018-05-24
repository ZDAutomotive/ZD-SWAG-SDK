import ioClient from 'socket.io-client';
import axios from 'axios';

export default class ViwiService {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6088;
    this.host = option.host || 'localhost'
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
   * update viwi messages
   */
  async parse() {
    if (!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/parse`)
    return res.data;
  }

  /**
   * post viwi event
   */
  async post(viwimsg) {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/post`, viwimsg)
    return res.data
  }

  /**
   * subscribe viwi events 
   */
  async subscribe(viwievent) {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/subscribe`, viwievent)
    return res.data
  }
  
  /**
   * unsubscribe viwi events
   */
  async unsubscribe(viwievent) {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/unsubscribe`, viwievent);
    return res.data;
  }
}
