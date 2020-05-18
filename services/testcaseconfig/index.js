import ioClient from 'socket.io-client';
import axios from 'axios';
import FormData from 'form-data'

export default class testcaseConfig {
  constructor(option) {
    option = option || {}
    this.port = option.port || 7010;
    this.host = option.host || 'localhost'
  }

  /**
   * @deprecated
   */
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

  /**
   * upload testcase config file
   */
  async uploadCfg(caseFile) {
    const form = new FormData()
    form.append('file', caseFile)
    let getHeaders = form => {
      return new Promise((resolve, reject) => {
        form.getLength((err, length) => {
          if (err) reject(err)
          let headers = Object.assign({
            'Content-Length': length
          }, form.getHeaders())
          resolve(headers)
        })
      })
    }
    let res = await axios.post(`http://${this.host}:${this.port}/upload`,form,{
      headers: await getHeaders(form)
    })
    return res.data
  }

  /**
   * download testcase config file
   */
  async downloadCfg() {
    let res = await axios.get(`http://${this.host}:${this.port}/download`)
    return res
  }

  /**
   * Get content of testcase config file
   */
  async getCfg(value) {
    let res = await axios.get(`http://${this.host}:${this.port}/config`)
    return res.data
  }

  /**
   * Modify content of testcase config file
   */
  async setCfg(content) {
    let res = await axios.post(`http://${this.host}:${this.port}/config`,{
      content
    })
    return res.msg
  }
}
