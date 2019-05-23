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
export default class Upload {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6071;
    this.host = option.host || 'localhost'
  }
  async upload(dirname, filename, caseFile) {
    const form = new FormData()
    const file = fs.readFileSync(caseFile) // read caseFile into buffer image
    form.append('file', file, filename)
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
}
