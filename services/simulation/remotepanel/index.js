import ioClient from 'socket.io-client'
import axios from 'axios'

export default class RemotepanelClient {
    constructor(option) {
        this.port = option.port || 6006;
        this.host = option.host || 'localhost'
        this.subscribeMap = {}
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
            reject(0)
            this.socket.removeAllListeners('connect')
            this.socket.removeAllListeners('connect_error')
            delete this.socket
          })
        })
    }
    /**
    * call remotePanel
    */
    // keyevent 
    // action:'exe'/'ret'(execute remotepanel / return canmsg)
    // keyid:'ZD_SDS'
    // keyboardid: 'MIB1' / 'MIB2'
    async hardkeyReq(_action, _keyid, _keyboardid) {
        let keyevent
        if (_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret') {
            switch(_keyboardid.toLowerCase()) {
            case 'mib1':
                keyevent = {
                    action: _action,
                    event: {
                        keyid: _keyid,
                        keyboardid: 2
                    }
                }
                break
            case 'mib1':
                keyevent = {
                    action: _action,
                    event: {
                        keyid: _keyid,
                        keyboardid: 1
                    }
                }
                break
            default:
                break      
            }
        }
        if (!keyevent) throw new Error('Unexpected parameters')
        if (!this.socket) throw new Error('Service not ready')
        let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/key`, keyevent)
        return res.data;
    }
    //touchevent 
    // action:'exe'/'ret'(execute remotepanel / return canmsg)
    // screentype:'top' / 'bottom'
    // x: 200
    // y: 200
    async tapReq(_action, _screentype, _x, _y) {
        let touchevent
        if (_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret') {
            switch(_screentype.toLowerCase()) {
            case 'top':
                touchevent = {
                    action: _action,
                    event: {
                        screentype: 1,
                        x: _x,
                        y: _y
                    }
                }
                break
            case 'upper':
                touchevent = {
                    action: _action,
                    event: {
                        screentype: 1,
                        x: _x,
                        y: _y
                    }
                }
                break
            case 'bottom':
                touchevent = {
                    action: _action,
                    event: {
                        screentype: 2,
                        x: _x,
                        y: _y
                    }
                }
                break
            case 'lower':
                touchevent = {
                    action: _action,
                    event: {
                        screentype: 2,
                        x: _x,
                        y: _y
                    }
                }
                break
            default:
                break      
            }
        }
        if (!touchevent) throw new Error('Unexpected parameters')
        if (!this.socket) throw new Error('Service not ready')
        let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/touch`, touchevent)
        return res.data;
    }
    //dragevent
    // action:'exe'/'ret'(execute remotepanel / return canmsg)
    // screentype:'top' / 'bottom'
    // x: 200
    // y: 200
    // dx: 200
    // dy: 0
    async dragReq(_action, _screentype, _x, _y, _dx, _dy) {
        let dragevent
        if (_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret') {
            switch(_screentype.toLowerCase()) {
            case 'top':
                dragevent = {
                    action: _action,
                    event: {
                        screentype: 1,
                        x: _x,
                        y: _y,
                        dx: _dx,
                        dy: _dy
                    }
                }
                break
            case 'upper':
                dragevent = {
                    action: _action,
                    event: {
                        screentype: 1,
                        x: _x,
                        y: _y,
                        dx: _dx,
                        dy: _dy
                    }
                }
                break
            case 'bottom':
                dragevent = {
                    action: _action,
                    event: {
                        screentype: 2,
                        x: _x,
                        y: _y,
                        dx: _dx,
                        dy: _dy
                    }
                }
                break
            case 'lower':
                dragevent = {
                    action: _action,
                    event: {
                        screentype: 2,
                        x: _x,
                        y: _y,
                        dx: _dx,
                        dy: _dy
                    }
                }
                break
            default:
                break      
            }
        }
        if (!dragevent) throw new Error('Unexpected parameters')
        if (!this.socket) throw new Error('Service not ready')
        let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/drag`, dragevent)
        return res.data;
    }
    //touchscreenshot {action:'exe'/'ret', event: {x:0, y:0}}
    // action:'exe'/'ret'(execute remotepanel / return canmsg)
    async touchscreenshotReq(_action) {
        let ssevent
        if (_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret') {
            ssevent = {
                action: _action,
                event: {
                    x: 0,
                    y: 0
                }
            }
        }
        if (!ssevent) throw new Error('Unexpected parameters')
        if (!this.socket) throw new Error('Service not ready')
        let res = await axios.post(`http://${this.host}:${this.port}/remotepanel/touchscreenshot`, ssevent)
        return res.data;
    }
         
}