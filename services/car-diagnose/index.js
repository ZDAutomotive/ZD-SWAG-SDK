import axios from 'axios';

export default class BAPTrace {
  constructor(option) {
    option = option || {}
    // this.port = option.port || 8081;
    this.name = option.name || 'car-diagnose'
    this.host = option.host || 'localhost'
    // this.urlPart = option.urlPart || 'car-diagnose'
  }

  async sendRaw(sub, dataArr, canID) {
    const res = await axios.post(
      `http://${this.host}/api/${this.name}/${sub}/sendraw`,
      {
        data: dataArr,
        canid: canID
      }
    )
    return res.data
  }

  async getDTC(sub, id, canID) {
    const res = await axios.get(
      `http://${this.host}/api/${this.name}/${sub}/dtc`,
      {
        params: {
          id,
          canid: canID
        }
      }
    )
    return res.data
  }

  async getDID(sub, id, canID) {
    const res = await axios.get(
      `http://${this.host}/api/${this.name}/${sub}/byidentifier`,
      {
        params: {
          id,
          canid: canID
        }
      }
    )
    return res.data
  }

  async writeDID(sub, id, dataArr, canID) {
    const res = await axios.post(
      `http://${this.host}/api/${this.name}/${sub}/byidentifier`,
      {
        data: dataArr,
        id,
        canid: canID
      }
    )
    return res.data
  }
}
