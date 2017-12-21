const ioClient = require('socket.io-client');
const axios = require('axios');
const canDPI = require('../../utils/can/dpi');

class TraceServer {
  constructor(option) {
    this.port = option.port || 6001;
    this.host = option.host || 'localhost'
  }

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
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
        delete this.socket
      })
    })
  }

  async pull(start, end, modules) {
    if (!this.socket) throw new Error('Service not ready')
    return (await axios.get(`http://${this.host}:${this.port}/trace`, {
      params: {
        duration: [start, end],
        modules
      }
    })).data
  }

  async hook(eventName, filterString) {
    return await axios.post(`http://${this.host}:${this.port}/hook`, {
      data: {
        eventName,
        filterString
      }
    })
  }

  async removeHook(eventName) {
    return await axios.delete(`http://${this.host}:${this.port}/hook`, {
      params: {
        eventName
      }
    })
  }

  /**
   * assert a CAN message on success or on failed
   * @param {Object} option
   * @param {string} option.signature string with '0x' or '0b'
   * @param {number} option.timeout default 5000, max waiting time for matching can msg
   * @param {boolean} option.onFailed when to trigger callback, true means on failed, false means on success
   */
  assertCAN(option) {
    return new Promise(async (resolve, reject) => {
      if (!this.socket) {
        reject(1)
        return
      }
      const hookName = `assert-can-${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}`
      // set timeout event
      const timer = setTimeout(() => {
        if (!option.onFailed) reject(2)
        else resolve(1)
        this.socket.removeAllListeners(hookName)
        this.removeHook(hookName)
      }, option.timeout || 5000)

      // set a hook
      await this.hook(hookName, 'canid != 0')
      this.socket.once(hookName, (name, trace) => {
        if (canDPI.verify(trace.data, option.signature)) {
          if (!option.onFailed) resolve(trace)
          else reject(2)
          clearTimeout(timer)
          this.removeHook(hookName)
        }
      })

      const now = Date.now()
      const checkBeginTime = now - 5000 // check from 5000ms before now

      const beforeCANs = await this.pull(checkBeginTime, now, ['can'])
      const foundBeforeCAN = beforeCANs.find(can => canDPI.verify(can.data, option.signature))
      if(foundBeforeCAN) {
        // found a matching CAN msg
        if (!option.onFailed) resolve(foundBeforeCAN)
        else reject(2)
        this.socket.removeAllListeners(hookName)
        clearTimeout(timer)
        this.removeHook(hookName)
        return
      }
    })
  }
}

module.exports = TraceServer;
