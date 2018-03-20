import ioClient from 'socket.io-client';
import axios from 'axios';

export default class TestService {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6000;
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
        reject('connect_error')
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
        delete this.socket
      })
    })
  }

  /**
   * load test script
   */
  async loadTestCase(script, ID) {
    if (!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/ts/testcase`, {script, ID});
    return res.data;
  }

  /**
   * get current test script list
   */
  async getTestCaseList() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.get(`http://${this.host}:${this.port}/ts/testcase`)
    return res.data
  }

  /**
   * delete test script by ID
   */
  async deleteTestCase(ID) {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/ts/delete`, {ID})
    return res.data
  }
  
  /**
   * delete all test script
   */
  async deleteAllTestCases() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/ts/deleteall`);
    return res.data;
  }

  async start() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/ts/start`);
    return res.data;
  }

  async stop() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/ts/stop`);
    return res.data;
  }

  async resume() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/ts/resume`);
    return res.data;
  }
  //{softwareVersion : ''}
  async setBenchConfig(benchConfig) {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.post(`http://${this.host}:${this.port}/ts/benchconfig`, benchConfig);
    return res.data;
  }
  async getBenchConfig() {
    if(!this.socket) throw new Error('Service not ready')
    let res = await axios.get(`http://${this.host}:${this.port}/ts/benchconfig`);
    return res.data;
  }
}
