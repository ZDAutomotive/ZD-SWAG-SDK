import axios from 'axios';

export default {
  async start() {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/start`)
    return res.data.isStarted
  },
  async stop() {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/stop`)
    return res.data.isStarted
  },
  async reset() {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/reset`)
    return res.data
  },
  async setCycle(canID) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/cycle/${canID}`)
    return res.data
  },
  async delCycle(canID) {
    const res = await axios.delete(`http://${this.host}:${this.port}/cansim/cycle/${canID}`)
    return res.data
  },
  async setCycleTime(canID, time) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/cycle/${canID}/time`, {
      time
    })
    return res.data
  },
  async setData(canID, data) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/data/${canID}`, {
      data
    })
    return res.data
  },
  async setDataByName(canID, name, value) {
    const res = await axios.post(`http://${this.host}:${this.port}/cansim/data/${canID}/${name}`, {
      value
    })
    return res.data
  },
}