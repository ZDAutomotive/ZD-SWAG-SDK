import ioClient from 'socket.io-client';
import axios from 'axios';
import FormData from 'form-data';

export default class TestService {
  constructor(option) {
    option = option || {}
    // this.port = option.port || 7001;
    this.name = option.name || 'test-service'
    this.host = option.host || 'localhost'
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}/`, {
        path: `/api/${this.name}/socket.io`
      });
      this.socket.on('connect', () => {
        resolve(1)
        this.socket.emit('identity', 'remote')
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
      })
      this.socket.on('connect_error', () => {
        reject('connect_error')
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
        this.socket.close()
        delete this.socket
      })
    })
  }

  /**
   * load test script
   */
  async loadTestCase(tasklist) {
    let res = await axios.post(`http://${this.host}/api/${this.name}/ts/testcase`, { tasklist });
    return res.data;
  }
  async loadTestCaseData(tasklist) {
    let res = await axios.post(`http://${this.host}/api/${this.name}/ts/testcase/data`, { tasklist });
    return res.data;
  }
  /**
   * get current test script list
   */
  async getTestCaseList() {
    let res = await axios.get(`http://${this.host}/api/${this.name}/ts/testcase`)
    return res.data
  }

  // async getTestCaseByID(ID) {
  //   let res = await axios.get(`http://${this.host}/api/${this.name}/ts/testcase/${ID}`)
  //   return res.data
  // }

  /**
   * delete test script by ID
   */
  async deleteTestCase(ID) {
    let res = await axios.delete(`http://${this.host}/api/${this.name}/ts/testcase`, {
      params: {
        id: ID
      }
    })
    return res.data
  }

  /**
   * delete all test script
   */
  async deleteAllTestCases() {
    let res = await axios.delete(`http://${this.host}/api/${this.name}/ts/testcase`);
    return res.data;
  }

  async start() {
    let res = await axios.post(`http://${this.host}/api/${this.name}/ts/start`);
    return res.data;
  }

  async stop() {
    let res = await axios.post(`http://${this.host}/api/${this.name}/ts/stop`);
    return res.data;
  }

  async pause() {
    let res = await axios.post(`http://${this.host}/api/${this.name}/ts/pause`);
    return res.data;
  }

  async resume() {
    let res = await axios.post(`http://${this.host}/api/${this.name}/ts/resume`);
    return res.data;
  }
  //{softwareVersion : ''}
  async setBenchConfig(benchConfig) {
    let res = await axios.post(`http://${this.host}/api/${this.name}/ts/benchconfig`, benchConfig);
    return res.data;
  }
  async getBenchConfig() {
    let res = await axios.get(`http://${this.host}/api/${this.name}/ts/benchconfig`);
    return res.data;
  }
  //{testLevel : '',
  // reportLevel: ''}
  async setTestConfig(testConfig) {
    let res = await axios.post(`http://${this.host}/api/${this.name}/ts/testconfig`, testConfig);
    return res.data;
  }
  async getTestConfig() {
    let res = await axios.get(`http://${this.host}/api/${this.name}/ts/testconfig`);
    return res.data;
  }

  /**
   * @param {stream.Readable} caseFile test case file as a buffer object
   */
  async uploadTestcase(dirname, filename, caseFile) {
    const form = new FormData()
    form.append('file', caseFile, filename)
    let getHeaders = form => {
      return new Promise((resolve, reject) => {
        form.getLength((err, length) => {
          if (err) reject(err)
          let headers = Object.assign({
            'Content-Length': length
          }, form.getHeaders())
          resolve(headers)
        })
      })
    }
    let res = await axios.post(`http://${this.host}/api/filemanage/upload?dirname=${dirname}`, form, {
      headers: await getHeaders(form)
    });
    return res.data;
  }
}