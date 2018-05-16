import axios from 'axios';

let host = 'locahost'
let port = 6006

export default {
  set host(val) {
    host = val
  },
  set port(val) {
    port = val
  },
  async start() {
    const res = await axios.post(`http://${host}:${port}/bapsim/state`, {
      isStarted: true
    })
    return res.data.isStarted === true
  },
  async stop() {
    const res = await axios.post(`http://${host}:${port}/bapsim/state`, {
      isStarted: false
    })
    return res.data.isStarted === false
  },
  async reset() {
    const res = await axios.delete(`http://${host}:${port}/bapsim/`)
    return res.data
  },
  async init(fileName) {
    const res = await axios.post(`http://${host}:${port}/bapsim/`, {
      fileName
    })
    return res.data
  },
  async getState() {
    const res = await axios.get(`http://${host}:${port}/bapsim/state`)
    return res.data
  },
  async getLSGList() {
    const res = await axios.get(`http://${host}:${port}/bapsim/`)
    return res.data
  },
  async setData(lsgID, fctID, data) {
    const res = await axios.post(`http://${host}:${port}/bapsim/lsg/${lsgID}/${fctID}`, {
      data
    })
    return res.data
  },
  async sendReq(lsgID, fctID, opCode, data) {
    const res = await axios.post(`http://${host}:${port}/bapsim/lsg/${lsgID}/${fctID}/${opCode}`, {
      data
    })
    return res.data
  },
  async switchLSG(lsgID, state) {
    const res = await axios.post(`http://${host}:${port}/bapsim/lsg/${lsgID}`, {
      state
    })
    return res.data
  },
  async loadConfig(fileName) {
    const res = await axios.post(`http://${host}:${port}/bapsim/data/all`, {
      fileName
    })
    return res.data
  },
  async startBAPCopy() {
    const res = await axios.post(`http://${host}:${port}/bapsim/bapcopy`, {
      isStarted: true
    })
    return res.data.isStarted === true
  },
  async stopBAPCopy() {
    const res = await axios.post(`http://${host}:${port}/bapsim/bapcopy`, {
      isStarted: false
    })
    return res.data.isStarted === false
  }
}