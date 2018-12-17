const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data');
const path = require("path")
// sendItem = {
//   image,
//   coord: "1397, 102, 65, 87"
// }
/**
 * 
 * @param {stream.Readable} caseFile test case file as a buffer object
 */
export default class OCR {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6017;
    this.host = option.host || 'localhost'
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
        console.log('conn error')
        reject('connect_error')
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
        delete this.socket
      })
      this.socket.on('disconnect', (msg) => {
        console.log(msg)
      })
    })
  }

  async uploadImage(dirname, filename, caseFile) {
    const form = new FormData()
    const image = fs.readFileSync(caseFile) // read caseFile into buffer image
    form.append('file', image, filename)
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
    let res = await axios.post(`http://${this.host}:${this.port}/api/filemanage/upload?dirname=${dirname}`, form, {
      headers: await getHeaders(form)
    });
  }

  async ocrTest(dirname, filename, coord) {
    let imagePath = path.join(dirname, filename)
    let ret = await axios.post(`http://${this.host}:${this.port}/ocr/findElement`, {
      imagePath,
      coord
    })
    console.log(ret.data)
    return ret.data
  }
}
