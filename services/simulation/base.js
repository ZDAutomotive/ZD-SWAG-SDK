export default class BaseSimulation {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6006;
    this.host = option.host || 'localhost'
  }
}