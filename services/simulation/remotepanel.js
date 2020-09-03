import axios from 'axios'
import BaseSimulation from './base'

export default class RemotePanel extends BaseSimulation {
  constructor(option) {
    super(option)
    this.subname = option.subname || 'remotepanel'
  }

  /**
    * call remotePanel
    */
  // keyevent 
  // action:'exe'/'ret'(execute remotepanel / return canmsg)
  // keyid:'ZD_SDS'
  // keyboardid: 'MIB1' / 'MIB2'
  async hardkeyReq(_action, _keyid, _keyboardid, channel ) {
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
        case 'mib2':
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
    let res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/key`, {keyevent, channel})
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
    let res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/touch`, touchevent)
    return res.data;
  }

  // long press event 
  // action:'exe'/'ret'(execute remotepanel / return canmsg)
  // screentype:'top' / 'bottom'
  // x: 200
  // y: 200
  // time: 3000 (unit ms)
  async longPress(_action, _screentype, _x, _y, time) {
    let pressevent
    if (_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret') {
      switch(_screentype.toLowerCase()) {
        case 'top':
          pressevent = {
            action: _action,
            event: {
              screentype: 1,
              x: _x,
              y: _y,
              time
            }
          }
          break
        case 'upper':
          pressevent = {
            action: _action,
            event: {
              screentype: 1,
              x: _x,
              y: _y,
              time
            }
          }
          break
        case 'bottom':
          console.log('do not support')
          break
        case 'lower':
          console.log('do not support')
          break
        default:
          break      
      }
    }
    if (!pressevent) throw new Error('Unexpected parameters')
    let res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/press`, pressevent)
    return res.data;
  }

  //swipeevent
  // action:'exe'/'ret'(execute remotepanel / return canmsg)
  // screentype:'top' / 'bottom'
  // x: 200
  // y: 200
  // dx: 200
  // dy: 0
  async swipeReq(_action, _screentype, _x, _y, _dx, _dy) {
    let swipeevent
    if (_action.toLowerCase() === 'exe' || _action.toLowerCase() === 'ret') {
      switch(_screentype.toLowerCase()) {
        case 'top':
          swipeevent = {
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
          swipeevent = {
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
          swipeevent = {
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
          swipeevent = {
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
    if (!swipeevent) throw new Error('Unexpected parameters')
    let res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/swipe`, swipeevent)
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
    let res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/touchscreenshot`, ssevent)
    return res.data;
  }

  async muSleep(active) {
    if (active) {
      let res = await axios.post(`http://${this.host}/api/${this.name}/${this.subname}/sleep`)
      return res.data;
    } else {
      let res = await axios.delete(`http://${this.host}/api/${this.name}/${this.subname}/sleep`)
      return res.data;
    }
  }
}