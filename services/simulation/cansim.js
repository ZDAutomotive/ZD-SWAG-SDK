import axios from 'axios'
import BaseSimulation from './base'
import * as ioClient from 'socket.io-client';

export default class CANSim extends BaseSimulation {
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}:${this.port}/`);
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
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/`, {
      fileName
    })
    return res.data
  }

  async start() {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/start`)
    return res.data.isStarted === true
  }

  async stop() {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/stop`)
    return res.data.isStarted === false
  }
  
  async reset() {
    const res = await axios.delete(`http://${this.host}:${this.port}/cansim/`)
    return res.data
  }

  async setCycle(canID) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/cycle/${canID}`)
    return res.data
  }

  async setCycleByCount(canID, count) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/cycle/${canID}`, {
      count
    })
    return res.data
  }

  async delCycle(canID) {
    const res = await axios.delete(`http://${this.host}:${this.port}/cansim/cycle/${canID}`)
    return res.data
  }

  async setCycleTime(canID, time) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/cycle/${canID}/time`, {
      time
    })
    return res.data
  }

  async setData(canID, data) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/data/${canID}`, {
      data
    })
    return res.data
  }

  async setDataByName(canID, name, value) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/data/${canID}/${name}`, {
      value
    })
    return res.data
  }

  async loadReplayFile(filepath = '/root/upload/tmp/canreplay.asc') {
    const res = await axios.get(`http://${this.host}:${this.port}/cansim/replay/loadfile?filepath=${filepath}`)
    return res.data
  }

  async startReplay() {
    const res = await axios.get(`http://${this.host}:${this.port}/cansim/replay/simplestart`)
    return res.data
  }

  async stopReplay() {
    const res = await axios.get(`http://${this.host}:${this.port}/cansim/replay/stop`)
    return res.data
  }
}