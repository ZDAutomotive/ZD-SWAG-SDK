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
    const res = await axios.post(`http://${host}:${port}/cansim/start`)
    return res.data.isStarted
  },
  async stop() {
    const res = await axios.post(`http://${host}:${port}/cansim/stop`)
    return res.data.isStarted
  },
  async reset() {
    const res = await axios.post(`http://${host}:${port}/cansim/reset`)
    return res.data
  },
  async setCycle(canID) {
    const res = await axios.post(`http://${host}:${port}/cansim/cycle/${canID}`)
    return res.data
  },
  async delCycle(canID) {
    const res = await axios.delete(`http://${host}:${port}/cansim/cycle/${canID}`)
    return res.data
  },
  async setCycleTime(canID, time) {
    const res = await axios.post(`http://${host}:${port}/cansim/cycle/${canID}/time`, {
      time
    })
    return res.data
  },
  async setData(canID, data) {
    const res = await axios.post(`http://${host}:${port}/cansim/data/${canID}`, {
      data
    })
    return res.data
  },
  async setDataByName(canID, name, value) {
    const res = await axios.post(`http://${host}:${port}/cansim/data/${canID}/${name}`, {
      value
    })
    return res.data
  },
}