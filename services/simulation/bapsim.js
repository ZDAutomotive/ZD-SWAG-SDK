import axios from 'axios'
import BaseSimulation from './base'

export default class BAPSim extends BaseSimulation {
  async start() {
    const res = await axios.post(`http://${host}:${port}/bapsim/state`, {
      isStarted: true
    })
    return res.data.isStarted === true
  }

  async stop() {
    const res = await axios.post(`http://${host}:${port}/bapsim/state`, {
      isStarted: false
    })
    return res.data.isStarted === false
  }

  async reset() {
    const res = await axios.delete(`http://${host}:${port}/bapsim/`)
    return res.status === 200
  }

  async init(fileName) {
    const res = await axios.post(`http://${host}:${port}/bapsim/`, {
      fileName
    })
    return res.data
  }

  async getState() {
    const res = await axios.get(`http://${host}:${port}/bapsim/state`)
    return res.data
  }

  async getLSGList() {
    const res = await axios.get(`http://${host}:${port}/bapsim/`)
    return res.data
  }

  async setData(lsgID, fctID, data) {
    const res = await axios.put(`http://${host}:${port}/bapsim/lsg/${lsgID}/${fctID}`, {
      data
    })
    return res.data
  }

  async sendReq(lsgID, fctID, opCode, data) {
    const res = await axios.post(`http://${host}:${port}/bapsim/lsg/${lsgID}/${fctID}/${opCode}`, {
      data
    })
    return res.data
  }

  async switchLSG(lsgID, state) {
    const res = await axios.put(`http://${host}:${port}/bapsim/lsg/${lsgID}`, {
      state
    })
    return res.data
  }

  async loadConfig(fileName) {
    const res = await axios.put(`http://${host}:${port}/bapsim/data/all`, {
      fileName
    })
    return res.data
  }

  async startBAPCopy() {
    const res = await axios.post(`http://${host}:${port}/bapsim/bapcopy`, {
      isStarted: true
    })
    return res.data.isStarted === true
  }

  async stopBAPCopy() {
    const res = await axios.post(`http://${host}:${port}/bapsim/bapcopy`, {
      isStarted: false
    })
    return res.data.isStarted === false
  }
}