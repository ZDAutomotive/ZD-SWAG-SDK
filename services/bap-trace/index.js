import ioClient from 'socket.io-client';
import axios from 'axios';

export default class BAPTrace {
  constructor(option) {
    option = option || {}
    // this.port = option.port || 6005;
    this.name = option.name || 'bap-trace'
    this.host = option.host || 'localhost'
    this.subscribeMap = {}
  }

  connect(type) {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}/`, {
        path: `/api/${this.name}/socket.io`
      });
      this.socket.on('connect', () => {
        resolve(1)
        if (type) this.socket.emit('identity', type)
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

  async bap2CAN(CANID, LSGID, FCTID, OPCODE, DATA, LEN) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/converter/bap2can`, {
      CANID,
      LSGID,
      FCTID,
      OPCODE,
      DATA,
      LEN
    })
    return res.data
  }

  async initView(fileName) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/bapview/`, {
      fileName
    })

    return res.data
  }

  async uninitView() {
    const res = await axios.delete(`http://${this.host}/api/${this.name}/bapview/`)

    return res.data
  }

  async getViewState() {
    const res = await axios.get(`http://${this.host}/api/${this.name}/bapview/`)

    return res.data
  }

  async parseBAP(bapmsg) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/bapview/parse`, bapmsg)

    return res.data
  }
}
