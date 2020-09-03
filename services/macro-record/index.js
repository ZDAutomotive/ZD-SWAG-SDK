import ioClient from 'socket.io-client'
import axios from 'axios'
export default class Macro {
  constructor(option) {
    option = option || {}
    // this.port = option.port || 7002;
    this.name = option.name || 'macro-service'
    this.host = option.host || 'localhost'
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}/`, {
        path: `/api/${this.name}/socket.io`
      });
      this.socket.on('connect', () => {
        resolve(1)
        this.socketId = this.socket.id
        this.socket.emit('identity', 'remote')
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
      })
      this.socket.on('connect_error', () => {
        // console.log('conn error')
        reject('connect_error')
        if(this.socket) {
          this.socket.removeAllListeners('connect')
          this.socket.removeAllListeners('connect_error')
          this.socket.close()
          delete this.socket
        }
      })
      this.socket.on('disconnect', (msg) => {
        console.log(msg)
      })
    })
  }
  
  async startRecording(mode) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/startRecord`, { mode })
    if (res.data.code === 2) return true
    return false
  }
  async stopRecording() {
    const res = await axios.post(`http://${this.host}/api/${this.name}/stopRecord`)
    if (res.data.code === 2) return res.data.msg
    return []
  }
  async playMacro(macro, timeout) {
    let res
    if (macro) {
      res = await axios.post(`http://${this.host}/api/${this.name}/playMacro`, {
        macro,
        timeout
      })
    } else {
      res = await axios.post(`http://${this.host}/api/${this.name}/playMacro`)
    }
    if (res.data.code === 2) return true
    return false
  }
  async getLastMacro() {
    const res = await axios.get(`http://${this.host}/api/${this.name}/getLastMacro`)
    if (res.data.code === 2) return res.data.msg
    return []
  }
}