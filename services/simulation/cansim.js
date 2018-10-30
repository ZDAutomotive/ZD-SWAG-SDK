import axios from 'axios'
import BaseSimulation from './base'

export default class CANSim extends BaseSimulation {
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
}