import ioClient from 'socket.io-client';
import axios from 'axios';
import canDPI from '../../utils/can/dpi';

export default class TraceServer {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6001;
    this.host = option.host || 'localhost'
    this.subscribeMap = {}
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}:${this.port}/`);
      this.socket.on('connect', () => {
        resolve(1)
        this.socketId = this.socket.id
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
    if (!this.socket) throw new Error('Service not ready')
    return await axios.post(`http://${this.host}:${this.port}/hook`, {
      id: this.socketId,
      eventName,
      filterString
    })
  }

  async removeHook(eventName) {
    if (!this.socket) throw new Error('Service not ready')
    return await axios.delete(`http://${this.host}:${this.port}/hook`, {
      params: {
        id: this.socketId,
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
      await this.hook(hookName, '{"protocol" = "CAN"}')
      this.socket.once(hookName, (trace) => {
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
      const foundBeforeCAN = beforeCANs.find(can => canDPI.verify(can.data.canmsg, option.signature))
      if (foundBeforeCAN) {
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

  /**
   * assert a eso keyword on success or on failed 
   * @param {Object} option
   * @param {string} option.channelID
   * @param {String} option.keyword
   * @param {number} option.timeout default 20000, max waiting time for matching can msg
   * @param {boolean} option.onFailed when to trigger callback, true means on failed, false means on success
   */
  assertESOTrace(option) {
    return new Promise(async (resolve, reject) => {
      if (!this.socket) {
        reject(1)
        return
      }
      const hookName = '';
      // set time out event
      const timer = setTimeout(() => {
        if (!option.onFailed) reject(2)
        else resolve(1)
        this.socket.removeAllListeners(hookName)
        this.removeHook(hookName)
      }, option.timeout || 20000);

      // set a hook
      await this.hook(hookName, `{"protocol" == "ESO"} && {"esotext"=="${option.keyword}"} && {"esoclid"=="${option.channelID}"}`)
      this.socket.on(hookName, (trace) => {
        //data.data.msgData
        // { size: 97,
        //   id: 4,
        //   data: 
        //    { timeStamp: 4660142,
        //      modifiers: 0,
        //      channelId: 10847,
        //      threadId: 7939,
        //      level: 'INFO',
        //      msgType: 'STRING_UTF8',
        //      size: 70,
        //      msgData: ' ~Dispatcher-HMIEvent~[ScreenChangeManager#showScreen] screenID=100137' } }        
        if (!option.onFailed) resolve(trace)
        else reject(2)
        clearTimeout(timer)
        this.removeHook(hookName)
      })

      const now = Date.now()
      const checkBeginTime = now - 5000 // check from 5000ms before now

      const beforeESOs = await this.pull(checkBeginTime, now, ['eso'])
      const foundBeforeESO = beforeESOs.find(
        trace => {
          (trace.data.msgData.data.channelId === option.channelID) &&
         (trace.data.msgData.data.msgData.indexOf(option.keyword)!== -1)})
      if (foundBeforeESO) {
        // found a matching CAN msg
        if (!option.onFailed) resolve(foundBeforeESO)
        else reject(2)
        this.socket.removeAllListeners(hookName)
        clearTimeout(timer)
        this.removeHook(hookName)
        return
      }
    })
  }

  /**
   * Subscribe a type of trace server message with custom event name
   * @param {String} name subscribed event name on which socket listens
   * @param {String} type subscribed event type, could be one of [CAN, BAP, ESO]
   * @param {String} [filterStr] subscribe additional filter string
   * @returns {boolean} tell whether operation succeed or not, if succeed, listen the event name on this.socket
   */
  async subscribe(name, type, filterStr) {
    if (!this.socket) throw new Error('Service not ready')

    switch (type) {
      case 'CAN':
      {
        let str = '{"protocol" == "CAN"}'
        if (filterStr) {
          str += ' && (' + filterStr + ')'
        }
        await this.hook(name, str)
        break;
      }
      case 'BAP':
      {
        let str = '{"protocol" == "BAP"}'
        if (filterStr) {
          str += ' && (' + filterStr + ')'
        }
        await this.hook(name, str)
        break;
      }
      case 'ESO':
      {
        let str = '{"protocol" == "ESO"}'
        if (filterStr) {
          str += ' && (' + filterStr + ')'
        }
        await this.hook(name, str)
        break;
      }
      default:
        throw new Error('unsupported subscribe type')
    }
    this.subscribeMap[name] = type

    return true
  }

  /**
   * Unsubscribe a event
   * @param {string} name event name to unsubscribe
   */
  async unsubscribe(name) {
    if (!this.socket) throw new Error('Service not ready')
    if (!this.subscribeMap[name]) throw new Error('name not exists')

    await this.removeHook(name)
    return true
  }

  async unsubscribeType(type) {
    if (!this.socket) throw new Error('Service not ready')

    const foundNames = Object.keys(this.subscribeMap)
      .filter(key => this.subscribeMap[key] === type)
    if (foundNames.length) {
      for (let name of foundNames) {
        await this.removeHook(name)
      }
    }
    return true
  }

  async setFilter(filters) {
    if (!this.socket) throw new Error('Service not ready')
    return await axios.post(`http://${this.host}:${this.port}/filter`, filters)
  }

  async getFilter() {
    if (!this.socket) throw new Error('Service not ready')
    return (await axios.get(`http://${this.host}:${this.port}/filter`)).data
  }
}