import axios from 'axios';

export default class BAPTrace {
  constructor(option) {
    option = option || {}
    this.port = option.port || 8081;
    this.host = option.host || 'localhost'
    this.urlPart = option.urlPart || '/car-diagnose'
  }

  async sendRaw(sub, dataArr) {
    const res = await axios.post(
      `http://${this.host}:${this.port}/api/${this.urlPart}/${sub}/sendraw`,
      dataArr
    )
    return res.data
  }

  async getDTC(sub, id) {
    const res = await axios.get(
      `http://${this.host}:${this.port}/api/${this.urlPart}/${sub}/dtc`,
      {
        params: {
          id
        }
      }
    )
    return res.data
  }

  async getDID(sub, id) {
    const res = await axios.get(
      `http://${this.host}:${this.port}/api/${this.urlPart}/${sub}/byidentifier`,
      {
        params: {
          id
        }
      }
    )
    return res.data
  }

  async writeDID(sub, id, dataArr) {
    const res = await axios.post(
      `http://${this.host}:${this.port}/api/${this.urlPart}/${sub}/byidentifier`,
      dataArr,
      {
        params: {
          id
        }
      }
    )
    return res.data
  }
}
