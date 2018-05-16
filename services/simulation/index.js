import ioClient from 'socket.io-client';
import Remotepanel from './remotepanel'
import CANSim from './cansim'
import BAPSim from './bapsim'

export default class Simulation {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6006;
    this.host = option.host || 'localhost'
    this.subscribeMap = {}
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}:${this.port}/`);
      this.socket.on('connect', () => {
        resolve(1)
        Remotepanel.host = this.host
        Remotepanel.port = this.port
        CANSim.host = this.host
        CANSim.port = this.port
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

  get Remotepanel() {
    if (!this.socket) throw new Error('Simualtion service not ready')
    return Remotepanel
  }

  get CANSim() {
    if (!this.socket) throw new Error('Simualtion service not ready')
    return CANSim
  }

  get BAPSim() {
    if (!this.socket) throw new Error('Simualtion service not ready')
    return BAPSim
  }
}
