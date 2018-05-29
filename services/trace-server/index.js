import ioClient from 'socket.io-client';
import axios from 'axios';
import crypto from 'crypto';
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
        reject('connect_error')
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
        delete this.socket
      })
    })
  }

  async getDuration() {
    if (!this.socket) throw new Error('Service not ready')
    return (await axios.get(`http://${this.host}:${this.port}/duration`)).data
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

  async hook(eventName, type, filterString) {
    if (!this.socket) throw new Error('Service not ready')
    return await axios.post(`http://${this.host}:${this.port}/hook`, {
      id: this.socketId,
      eventName,
      filterString,
      type
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

      const duration = await this.getDuration()
      const now = duration.end
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
        reject('connect_error')
        return
      }
      const hookName = crypto.createHash('md5').update(JSON.stringify(option)).digest('hex');
      // set time out event
      const timer = setTimeout(() => {
        this.socket.removeAllListeners(hookName)
        this.removeHook(hookName).then(() => {
          if (!option.onFailed) resolve({
            res: false,
            trace: ''
          })
          else resolve({
            res: true,
            trace: ''
          })
        })
      }, option.timeout || 20000);

      // set a hook
      await this.hook(hookName, 'ESO', `{"esotext"=="${option.keyword}"}`) // && {"esoclid"=="${option.channelID}"}`)
      //console.log('waiting for hook')
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
        if (!option.onFailed) resolve({
          res: true,
          trace
        })
        else resolve({
          res: false
        })
        clearTimeout(timer)
        this.removeHook(hookName)
      })

      const duration = await this.getDuration()
      const now = duration.end
      const checkBeginTime = now - 5000 // check from 5000ms before now

      const beforeESOs = await this.pull(checkBeginTime, now, ['eso'])
      //trace.data.data.channel === eso trace port
      const foundBeforeESO = beforeESOs.find(
        trace => {
          // (trace.data.data.msgData.data.channelId === option.channelID) &&
          return trace.data.data.msgData.data.msgData.data &&
            (trace.data.data.msgData.data.msgData.data.indexOf(option.keyword) !== -1)
        })
      if (foundBeforeESO) {
        // found a matching CAN msg
        if (!option.onFailed) resolve({
          res: true,
          trace: foundBeforeESO[0]
        });
        else resolve({
          res: false,
          trace: foundBeforeESO[0]
        });
        this.socket.removeAllListeners(hookName)
        clearTimeout(timer)
        this.removeHook(hookName)
        return
      }
    })
  }

  /**
   * assert multi eso keyword on success
   * @param {Array} optionList  contain a list of assertion
   * @param {Object} option
   * @param {number} option.timeout default 20000, max waiting time for matching can msg
   * @param {string} assertion.channelID
   * @param {String} assertion.keyword
   * @param {boolean} assertion.singleReturn default false, will be resolve true, when singleReturn eso keyword exist. 
   */
  assertMultiESOTraces(option, assertionList) {
    return new Promise(async (resolve, reject) => {
      if (!this.socket) {
        reject('connect_error')
        return
      }
      let expectedList = {};
      let timerList = {};
      let timerMultiESO = setTimeout(() => {
        //let result = true;
        for(let i = 0; i < Object.keys(expectedList).length; i++) {
          if(expectedList[Object.keys(expectedList)[i]].onMessage === false) {
            resolve({
              res: false,            
              traces: expectedList
            })
            return
          }
        }
        resolve({
          res: true,
          successReason: 'all',  
          traces: expectedList
        })
      }, option.timeout || 21000);

      assertionList.forEach(async (elem) => {
        const hookName = crypto.createHash('md5').update(JSON.stringify(elem)).digest('hex');
        expectedList[hookName] = {
          onMessage: false,
          keyword: elem.keyword,
          trace: '',
          singleReturn: elem.singleReturn
        };
        // set time out event
        let timer = setTimeout(() => {
          this.unsubscribe(hookName);
          this.socket.removeAllListeners(hookName)
          // this.removeHook(hookName)
        }, option.timeout || 20000);
        timerList[hookName] = timer;
        // set a hook
        await this.subscribe(hookName, 'ESO', `{"esotext"=="${elem.keyword}"}`);
        //await this.hook(hookName, 'ESO', `{"esotext"=="${elem.keyword}"}`) // && {"esoclid"=="${option.channelID}"}`)
        //console.log('waiting for hook')
        this.socket.once(hookName, (trace) => { 
          //console.log(trace.data.msgData.data.msgData.data);
          console.log('on event', hookName, elem.singleReturn);
          expectedList[hookName].onMessage = true;
          expectedList[hookName].trace = trace.data.msgData.data.msgData.data
          clearTimeout(timer)
          this.unsubscribe(hookName);
          this.socket.removeAllListeners(hookName)
          if(expectedList[hookName].singleReturn) {
            resolve({
              res: true,
              successReason: 'single',
              traces: expectedList
            })
            clearTimeout(timerMultiESO);
          } else {
            let result = true
            for(let i = 0; i < Object.keys(expectedList).length; i++) {
              if(expectedList[Object.keys(expectedList)[i]].onMessage === false) {
                result = false 
                break;
              }
            }
            if(result) {
              resolve({
                res: true,
                successReason: 'all',  
                traces: expectedList
              })
              clearTimeout(timerMultiESO);
            } 
          }
        })
        //trace.data.data.channel === eso trace port
      });
      const duration = await this.getDuration()
      const now = duration.end
      const checkBeginTime = now - (option.before || 5000) // check from 5000ms before now
      console.log(duration);
      console.log('start', checkBeginTime, 'end', now);
      const beforeESOs = await this.pull(checkBeginTime, now, ['ESO'])
      console.log('length', beforeESOs.length)
      console.log('first msg', beforeESOs[0]);
      console.log('first msg', beforeESOs[0].data.data.msgData.data.msgData.data)
      
      Object.keys(expectedList).forEach(hookName => {
        const foundBeforeESO = beforeESOs.find(
          trace => {
            if(trace.data.data.msgData.data.msgData){
            // (trace.data.data.msgData.data.channelId === option.channelID) &&
              return (typeof trace.data.data.msgData.data.msgData.data === 'string') &&
              (trace.data.data.msgData.data.msgData.data.toUpperCase().indexOf(expectedList[hookName].keyword.toUpperCase()) !== -1)
            } else {
              return false;
            }
          })
        //console.log(foundBeforeESO)
        if (foundBeforeESO) {
          console.log(foundBeforeESO.data.data.msgData.data.msgData.data);
          expectedList[hookName].onMessage = true;
          expectedList[hookName].trace = foundBeforeESO.data.data.msgData.data.msgData.data
          clearTimeout(timerList[hookName]);
          this.unsubscribe(hookName);
          this.socket.removeAllListeners(hookName)
          // this.removeHook(hookName)
          let result = true
          for(let i = 0; i < Object.keys(expectedList).length; i++) {
            if(expectedList[hookName].singleReturn && expectedList[Object.keys(expectedList)[i]].onMessage === true) {
              resolve({
                res: true,
                successReason: 'single',
                traces: expectedList
              })
              clearTimeout(timerMultiESO);
              return;
            }
            if(expectedList[Object.keys(expectedList)[i]].onMessage === false) {
              result = false 
              //break;
            }
          }
          if(result) {
            resolve({
              res: true,
              successReason: 'all',
              traces: expectedList
            })
            clearTimeout(timerMultiESO);
          }
        }
      })
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
    if (!filterStr) throw new Error('Missing filter string')

    await this.hook(name, type.toUpperCase(), filterStr)
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

  async getPersistenceFileList(start, end) {
    if (!this.socket) throw new Error('Service not ready')
    return (await axios.get(`http://${this.host}:${this.port}/persistence/list`, {
      params: {
        start,
        end
      }
    })).data
  }

  /**
   * request downloading a persistence file as a stream
   * @param {string} filepath 
   * @returns {Stream}
   */
  async downloadPersistenceFile(filepath) {
    if (!this.socket) throw new Error('Service not ready')
    return (await axios.get(`http://${this.host}:${this.port}/persistence`, {
      params: {
        filepath,
      },
      responseType: 'stream'
    })).data
  }
}
