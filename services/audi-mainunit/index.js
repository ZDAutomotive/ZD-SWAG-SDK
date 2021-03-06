import ioClient from 'socket.io-client';
import axios from 'axios';

export default class MainUnit {
  constructor(option) {
    option = option || {}
    this.port = option.port || 6009;
    this.host = option.host || 'localhost'
    this.subscribeMap = {}
  }

  /**
   * @deprecated
   */
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
        this.socket.removeAllListeners('connect')
        this.socket.removeAllListeners('connect_error')
        delete this.socket
      })
    })
  }

  /**
   * get VIN of MU
   */
  async getVIN() {
    let res = await axios.get(`http://${this.host}:${this.port}/envstatus/vin`)
    return res.data;
  }

  /**
   * get Version Info of MU
   * {
   *  APP,
   *  NavDB,
   *  HMI,
   *  SDS-TextToolVersion
   * }
   */
  async getVersionInfo(){
    let res  = await axios.get(`http://${this.host}:${this.port}/envstatus/versioninfo`)
    return res.data;
  }

  /**
   * get backend of MU
   */
  async getBackend() {
    let res = await axios.get(`http://${this.host}:${this.port}/envstatus/backend`)
    return res.data
  }

  /**
   * trigger MU reset with persistence
   */
  async resetWithPersistence() {
    let res = await axios.post(`http://${this.host}:${this.port}/envstatus/resetwithpers`, {token:'resetWithPers'})
    return res.data
  }
  
  /**
   * set backend of MU
   */
  async setBackend(backend) {
    let res = await axios.post(`http://${this.host}:${this.port}/envstatus/backend`, backend);
    return res.data;
  }

  /**
   * fetch files from MU to service folder(remote local)
   */
  async fetchFiles(serverFile, remoteFolder){
    let res = await axios.post(`http://${this.host}:${this.port}/mu/fetchfiles`, {files: serverFile, toPath: remoteFolder});
    return res.data;
  }

  /**
   * fetch files from MU to service folder(remote local)
   */
  async fetchMIB3SYSFiles(serverPath, remoteFolder){
    let res = await axios.post(`http://${this.host}:${this.port}/mib3sys/fetchfiles`, {files: serverPath, toPath: remoteFolder});
    return res.data;
  }

  async getCurrentScreenID() {
    let res = await axios.get(`http://${this.host}:${this.port}/mu/currentscreenid`);
    return res.data.screenID;
  }

  async getCurrentVisiblePopupID() {
    let res = await axios.get(`http://${this.host}:${this.port}/mu/currentvisiblepopupid`);
    return res.data.popupID;
  }

  /**
   * get widget infos of current screen 
   */
  async getWidgetInfosOfCurrentScreen() {
    let res = await axios.get(`http://${this.host}:${this.port}/mu/WidgetInfosOfCurrentScreen`);
    return res.data.widgetInfos;
  }

  async getStartupTestMode() {
    let res = await axios.get(`http://${this.host}:${this.port}/envstatus/startuptestmode`);
    return res.data.state;
  }

  async setStartupTestMode(state) {
    let res = await axios.post(`http://${this.host}:${this.port}/envstatus/startuptestmode`, {
      enable: state
    });
    return res.data.state;
  }

  async resetEsoToDefault() {
    let res = await axios.post(`http://${this.host}:${this.port}/envstatus/resetesotrace`, {token:'resetEsoTraceDefault'})
    return res.data
  }

  async cmdSingleSpeak(text) {
    let res = await axios.post(`http://${this.host}:${this.port}/mu/cmdSingleSpeak`, {text})
    return res.data
  } 
}
