import axios from 'axios'
import BaseSimulation from './base'
import * as ioClient from 'socket.io-client';

export default class CANSim extends BaseSimulation {
  constructor(option) {
    super(option)
    this.subname = option.subname || 'cansim'
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

  async init(fileName) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/`, {
      fileName
    })
    return res.data
  }

  async start() {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/start`)
    return res.data.isStarted === true
  }

  async stop() {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/stop`)
    return res.data.isStarted === false
  }
  
  async reset() {
    const res = await axios.delete(`http://${this.host}/api/${this.name}/${this.subname}/`)
    return res.data
  }

  async setCycle(canID) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/cycle/${canID}`)
    return res.data
  }

  async setCycleByCount(canID, count) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/cycle/${canID}`, {
      count
    })
    return res.data
  }

  async delCycle(canID) {
    const res = await axios.delete(`http://${this.host}/api/${this.name}/${this.subname}/cycle/${canID}`)
    return res.data
  }

  async setCycleTime(canID, time) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/cycle/${canID}/time`, {
      time
    })
    return res.data
  }

  async setData(canID, data) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/data/${canID}`, {
      data
    })
    return res.data
  }

  async setDataByName(canID, name, value) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/data/${canID}/${name}`, {
      value
    })
    return res.data
  }

  async getReplayStatus() {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/replay/status`)
    return res.data
  }

  async loadReplayFile(filepath, canbus) {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/replay/loadfile?filepath=${filepath}&canbus=${canbus}`)
    return res.data
  }

  async removeReplayFile(filepath, canbus) {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/replay/removefile?filepath=${filepath}&canbus=${canbus}`)
    return res.data
  }

  async clearReplayFile(filepath, canbus) {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/replay/clearfile?canbus=${canbus}`)
    return res.data
  }

  async startReplay() {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/replay/start`)
    return res.data
  }

  async simpleStartReplay() {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/replay/simplestart`)
    return res.data
  }

  async stopReplay() {
    const res = await axios.get(`http://${this.host}/api/${this.name}/${this.subname}/replay/stop`)
    return res.data
  }
}