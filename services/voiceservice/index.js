import ioClient from 'socket.io-client';
import axios from 'axios';

export default class VoiceService {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6015;
    this.host = option.host || 'localhost'
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = ioClient.connect(`http://${this.host}:${this.port}/`);
      this.socket.on('connect', () => {
        resolve(1)
        this.socket.emit('identity', 'remote')
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
      })
      this.socket.on('connect_error', () => {
        reject(1)
        if(this.socket) {
          this.socket.removeAllListeners('connect')
          this.socket.removeAllListeners('connect_error')
          this.socket.close()
          delete this.socket
        }
      })
    })
  }

  /**
   * play voice on ZDBox
   */
  async play(db, text) {
    let res = await axios.post(`http://${this.host}:${this.port}/voiceDB/local/play`, {
      db,
      text
    })
    return res.data;
  }

  /**
   * record voice
   */
  async record(db, text) {
    let res = await axios.post(`http://${this.host}:${this.port}/voiceDB/local/record`, {
      db,
      text
    })
    return res.data
  }

  /**
   * record (Audi TTS engine) voice 
   */
  async recordAudiTTS(db, text) {
    let res = await axios.post(`http://${this.host}:${this.port}/voiceDB/local/recordauditts`, {
      db,
      text
    })
    return res.data
  }

  /**
   * check if voice aviliable
   */
  async checkVoice(db, text) {
    let res = await axios.post(`http://${this.host}:${this.port}/voiceDB/database/checkvoice`, {
      db,
      text
    });
    return res.data;
  }

  /**
   * delete voice in db
   */
  async deleteVoice(db, text) {
    let res = await axios.delete(`http://${this.host}:${this.port}/voiceDB/database/checkvoice`, {
      params: {
        db,
        text
      }
    });
    return res.data;
  }

  /**
   * delete all voice for voice database
   * @param {voice db} db 
   */
  async deleteAllVoice(db) {
    let res = await axios.delete(`http://${this.host}:${this.port}/voiceDB/database/allvoices`, {
      params: {
        db
      }
    });
    return res.data;
  }
}