import ioClient from 'socket.io-client';
import axios from 'axios';

export default class MainUnit {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6009;
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
        reject(1)
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
        delete this.socket
      })
    })
  }

  /**
   * get VIN of MU
   */
  async getVIN() {
    if (!this.socket) throw new Error('Service not ready')
    let res = await axios.get(`http://${this.host}:${this.port}/envstatus/vin`)
    return res.data;
  }

  /**
   * get backend of MU
   */
  async getBackend() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.get(`http://${this.host}:${this.port}/envstatus/backend`)
    return res.data
  }

  /**
   * trigger MU reset with persistence
   */
  async resetWithPersistence() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/envstatus/resetwithpers`, {token:'resetWithPers'})
    return res.data
  }
  
  /**
   * set backend of MU
   */
  async setBackend(backend) {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/envstatus/backend`, backend);
    return res.data;
  }

  /**
   * fetch files from MU to service folder(remote local)
   */
  async fetchFiles(serverFile, remoteFolder){
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/mu/fetchfiles`, {files: serverFile, toPath: remoteFolder});
    return res.data;
  }

  async getCurrentScreenID() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.get(`http://${this.host}:${this.port}/mu/currentscreenid`);
    return res.data.screenID;
  }

  async getStartupTestMode() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.get(`http://${this.host}:${this.port}/envstatus/startuptestmode`);
    return res.data.state;
  }

  async setStartupTestMode(state) {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/envstatus/startuptestmode`, {
      enable: state
    });
    return res.data.state;
  }

  async resetEsoToDefault() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/envstatus/resetesotrace`, {token:'resetEsoTraceDefault'})
    return res.data
  }
}
