export default class BaseSimulation {
  constructor(option) {
    option = option || {}
    // this.port = option.port || 6006;
    this.name = option.name || 'simulation'
    this.host = option.host || 'localhost'
  }
}