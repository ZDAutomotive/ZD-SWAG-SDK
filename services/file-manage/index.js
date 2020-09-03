// import ioClient from 'socket.io-client';
import axios from 'axios';
import FormData from 'form-data';

export default class TestService {
  constructor(option) {
    option = option || {}
    // this.port = option.port || 7001;
    this.name = option.name || 'filemanage'
    this.host = option.host || 'localhost'
  }

  /**
   * @param {stream.Readable} fileStream test case file as a buffer object
   */
  async uploadFile(dirname, filename, fileStream) {
    const form = new FormData()
    form.append('file', fileStream, filename)
    const getHeaders = form => {
      return new Promise((resolve, reject) => {
        form.getLength((err, length) => {
          if (err) reject(err)
          const headers = Object.assign({
            'Content-Length': length
          }, form.getHeaders())
          resolve(headers)
        })
      })
    }
    const res = await axios.post(`http://${this.host}/api/${this.name}/upload?dirname=${dirname}`, form, {
      headers: await getHeaders(form)
    });
    return res.data;
  }

  /**
   * download a single file, return a readable stream.
   * @param {string} remotepath 
   * @returns {stream.Readable} outputStream 
   */
  async downloadFile(remotepath) {
    const res = await axios({
      method: 'get',
      url: `http://${this.host}/api/${this.name}/download`,
      params: { filepath: remotepath },
      responseType: 'stream'
    })
    return res.data
  }

  /**
   * download some folders, return a readable stream of batch zip.
   * @param {Array<string>} dirList 
   * @returns {stream.Readable} outputStream 
   */
  async downloadBatch(dirList) {
    const res = await axios.post(`http://${this.host}/api/${this.name}/download/batch`, dirList)
    return await this.downloadFile(res.data.filepath)
  }

  /**
   * list dir content with specific file extension
   * @param {string} dirname 
   * @param {string} extension 
   * @returns {Array<string>} dir content
   */
  async listDir(dirname, extension) {
    return await axios.get(`http://${this.host}/api/${this.name}/dir/list`, {
      params: { dirname, extension }
    })
  }

  /**
   * get dir tree
   * @param {string} dirname 
   */
  async treeDir(dirname) {
    return await axios.get(`http://${this.host}/api/${this.name}/dir/tree`, {
      params: { dirname }
    })
  }
}