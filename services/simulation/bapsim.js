import axios from 'axios'
import BaseSimulation from './base'
import * as ioClient from 'socket.io-client';

export default class BAPSim extends BaseSimulation {
  constructor(option) {
    super(option)
    this.subname = option.subname || 'bapsim'
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}/`, {
        path: `/api/${this.name}/socket.io`
      });
      this.socket.on('connect', () => {
        resolve(1)
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

  async start() {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/state`, {
      isStarted: true
    })
    return res.data.isStarted === true
  }

  async stop() {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/state`, {
      isStarted: false
    })
    return res.data.isStarted === false
  }

  async reset() {
    const res = await axios.delete(`http://${this.host}/api/${this.name}/${this.subname}/`)
    return res.status === 200
  }

  async init(fileName) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/`, {
      fileName
    })
    return res.data
  }

  async getState() {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/state`)
    return res.data
  }

  async getLSGList() {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/`)
    return res.data
  }

  async setData(lsgID, fctID, data) {
    const res = await axios.put(`http://${this.host}/api/${this.name}/${this.subname}/lsg/${lsgID}/${fctID}`, {
      data
    })
    return res.data
  }

  async sendReq(lsgID, fctID, opCode, data) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/lsg/${lsgID}/${fctID}/${opCode}`, {
      data
    })
    return res.data
  }

  async switchLSG(lsgID, state) {
    const res = await axios.put(`http://${this.host}/api/${this.name}/${this.subname}/lsg/${lsgID}`, {
      state
    })
    return res.data
  }

  async loadConfig(fileName) {
    const res = await axios.put(`http://${this.host}/api/${this.name}/${this.subname}/data/all`, {
      fileName
    })
    return res.data
  }

  async startBAPCopy(isCopyTx = false) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/bapcopy`, {
      isStarted: true,
      isCopyTx
    })
    return res.data.isStarted === true
  }

  async stopBAPCopy() {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/bapcopy`, {
      isStarted: false
    })
    return res.data.isStarted === false
  }
}