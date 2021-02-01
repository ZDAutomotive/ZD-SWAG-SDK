import axios from 'axios';
import fs from 'fs';
import ioClient from 'socket.io-client';
import FormData from 'form-data';
import path from 'path';
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
    this.port = option.port || 6071;
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
    return res
  }

  async subscribe(image, coord, screenType) {
    let res = await axios.post(`http://${this.host}:${this.port}/subscribe`, { image, coord, screenType })
    return res.data
  }

  async unsubscribeAll() {
    await axios.post(`http://${this.host}:${this.port}/unsubscribeAll`)
  }

  async findColor(dirname, filename, coord, threshold, screenType) {
    let imagePath = path.join(dirname, filename)
    let ret = await axios.post(`http://${this.host}:${this.port}/findItem`, {
      imagePath,
      threshold,
      coord,
      screenType,
      mode: "findColor"
    })
    const iconPosition = ret.data
    return iconPosition
  }

  async findIcon(dirname, filename, coord, threshold, screenType) {
    let imagePath = path.join(dirname, filename)
    let ret = await axios.post(`http://${this.host}:${this.port}/findItem`, {
      imagePath,
      threshold,
      coord,
      screenType,
      mode: 0
    })
    const iconPosition = ret.data
    return iconPosition
  }

  async matchIcon(dirname, filename, coord, threshold, screenType) {
    let imagePath = `${dirname}/${filename}`
    let ret = await axios.post(`http://${this.host}:${this.port}/findItem`, {
      imagePath,
      threshold,
      coord,
      screenType,
      mode: 1
    })
    const iconPosition = ret.data
    return iconPosition
  }

  async findText(text, coord, lang, conf, psm, screenType, whitespace) {
    let ret = await axios.post(`http://${this.host}:${this.port}/ocr`, {
      text,
      coord,
      lang,
      conf,
      psm,
      screenType,
      whitespace
    })
    const textContent = ret.data
    return textContent
  }

  async checkColor(color) {
    let ret = await axios.post(`http://${this.host}:${this.port}/compareColor`, {
      color
    })
    const isColor = ret.data
    return isColor
  }

  async getScreenshot() {
    let res = await axios.get(`http://${this.host}:${this.port}/roi`)
    request(`http://${this.host}:${this.port}/ocr/screenshot`).pipe(fs.createWriteStream('image.png'))
    return res
  }
}
