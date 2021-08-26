import { Stream, Readable } from 'stream';
import { AxiosResponse } from 'axios';

declare interface BasicOption {
  /**
   * port of SDK client
   */
  port?: number;

  /**
   * remote host of SDK client
   * @default 'localhost'
   */
  host?: string;

  urlPart?: string;
}

export class AndroidProberProxy {
  socket: SocketIOClient.Socket;
  constructor(option?: object);

  listen(): SocketIOClient.Socket;
  connect(): void;
}

declare class Base {
  port: number;
  host: string;
  constructor(option?: BasicOption);
  /**
   * @deprecated
   * @returns {Promise<number>}
   * @memberof Base
   */
  connect(): Promise<number>;
}

declare class BaseSocket {
  port: number;
  host: string;
  socket: SocketIOClient.Socket;
  constructor(option?: BasicOption);
  connect(): Promise<number>;
}

export class TraceServer extends BaseSocket {
  subscribeMap: { [name: string]: string };
  getDuration(): Promise<{ start: number, end: number }>;
  pull(start: number, end: number, modules: Array<string>): Promise<Array<object>>;
  hook(eventName: string, type: string, filterString: string): Promise<{ code: number }>;
  removeHook(eventName: string): Promise<{ code: number }>;

  assertCAN(option: {
    signature: string;
    timeout: number;
    onFailed: boolean;
  }): Promise<any>;
  assertESOTrace(option: {
    channelID: string;
    keyword: string;
    timeout: number;
    onFailed: boolean;
  }): Promise<{
    res: boolean,
    trace?: string
  }>;
  assertMultiESOTraces(option: {
    timeout: number;
  }, assertionList: Array<{
    channelID: string;
    keyword: string;
    singleReturn: boolean;
  }>): Promise<{
    res: boolean;
    successReason?: string;
    traces: object
  }>;
  subscribe(name: string, type: string, filterString: string): Promise<boolean>;
  unsubscribe(name: string): Promise<boolean>;
  unsubscribeType(type: string): Promise<boolean>;
  setFilter(filters: Array<object>): Promise<any>;
  getFilter(): Promise<Array<object>>;
  getPersistenceFileList(start: number, end: number): Promise<Array<string>>;
  downloadPersistenceFile(filepath: string): Promise<Stream>;
  HeadPersistenceFile(filepath: string): Promise<any>;
}

export class TTS {
  option: any;
  constructor(option?: any);
  new(data: object, cb: (isErr: boolean, data: any) => void): any;
  update(id: any, data: object, cb: (isErr: boolean, data: any) => void): any;
  delete(id: any, cb: (isErr: boolean, data: any) => void): any;
  get(text: string, cb: (isErr: boolean, data: any) => void): any;
}

export class OCR extends Base{
  uploadImage(dirname: string, filename: string, caseFile: string): Promise<{
    res: AxiosResponse;
  }>;
  findColor(dirname: string, filename: string, coord: any, threshold: number, screenType: string, pngAbsolutePath: string): Promise<{ 
    code: number,
    msg: any
  }>
  findIcon(dirname: string, filename: string, coord: any, threshold: number, screenType: string, pngAbsolutePath: string): Promise<{ 
    code: number,
    msg: any
  }>
  matchIcon(dirname: string, filename: string, coord: any, threshold: number, screenType: string, pngAbsolutePath: string): Promise<{ 
    code: number,
    msg: any
  }>
  findText(text: string, coord: object, lang: string, conf: number, psm: number, screenType: string, whitespace: number, pngAbsolutePath: string): Promise<{
    code: number,
    msg: any
  }>
  checkColor(color: string, screenType: string, pngAbsolutePath: string): Promise<{
    code: number,
    result: any
  }>
  getScreenshot(): Promise<{
    res: object
  }>
  subscribe(): Promise<{
    res: object
  }>
  unsubscribeAll(): Promise<{
    res: object
  }>
}
export class Upload extends Base{
  upload(dirname: string, filename: string, caseFile: string): Promise<{
    res: AxiosResponse;
  }>;
}
export class Macro extends Base{
  startRecording(): Promise<{
    res: boolean
  }>
  stopRecording(): Promise<{
    res: Array<object>
  }>
  playMacro(macro: object[], timeout: number): Promise<{
    res: boolean
  }>
  getLastMacro(): Promise<{
    res: Array<object>
  }>
}

export class AudiMainUnit extends Base {
  getVIN(): Promise<{
    VIN: string
  }>;
  getVersionInfo(): Promise<{
    APP: string;
    NavDB: string;
    HMI: string;
    'SDS-TextToolVersion': string;
  }>;
  getBackend(): Promise<{
    backend: string
  }>;
  resetWithPersistence(): Promise<object>;
  setBackend(backend: string): Promise<{
    backend: string
  }>;
  fetchFiles(serverFile: string, remoteFolder: string): Promise<{
    files: string[]
  }>;
  fetchMIB3SYSFiles(serverPath: string, remoteFolder: string): Promise<{
    files: string[]
  }>;
  getCurrentScreenID(): Promise<string>;
  getCurrentVisiblePopupID(): Promise<string>;
  getWidgetInfosOfCurrentScreen(): Promise<any>;
  getStartupTestMode(): Promise<boolean>;
  setStartupTestMode(state: boolean): Promise<boolean>;
  resetEsoToDefault(): Promise<any>;
  cmdSingleSpeak(text: string): Promise<any>;
}

export class CANTrace extends BaseSocket {
  sendCANMsg(name: string, canmsg: object): Promise<any>;
  sendMultiCANMsgs(name: string, canmsgs: object[]): boolean;
}

export class BAPTrace extends BaseSocket {
  bap2CAN(CANID: number, LSGID: number, FCTID: number, OPCODE: number, DATA: number[], LEN: number): Promise<object>;
  initView(fileName: string): Promise<object>;
  uninitView(): Promise<object>;
  getViewState(): Promise<object>;
  parseBAP(bapmsg: object): Promise<object>;
}

export class CANView extends BaseSocket {
  initCANBC(fileName: string): Promise<{ code: number }>;
  getCANBC(): Promise<{
    name: string;
    template: object;
  }>;
  deleteCANBC(): Promise<{ code: number }>;
  parse(canmsg: {
    ID: number;
    LEN: number;
    DATA: number[];
  }): Promise<{
    canID: number;
    LEN: number;
    name: any;
    values: any[];
  }>;
}

export interface Simulation {
  RemotePanel: RemotePanel;
  CANSim: CANSim;
  BAPSim: BAPSim;
}

export class RemotePanel extends Base {
  hardkeyReq(_action: string, _keyid: string, _keyboardid: string): Promise<{
    code: number;
  } | {
    canmsg: {
      ID: number;
      MSGTYPE: number;
      LEN: number;
      DATA: any[];
    };
    time: number;
  }[]>;

  tapReq(_action: string, _screentype: string, _x: number, _y: number): Promise<{
    code: number;
  } | {
    canmsg: {
      ID: number;
      MSGTYPE: number;
      LEN: number;
      DATA: any[];
    };
    time: number;
  }[]>;

  longPress(_action: string, _screentype: string, _x: number, _y: number, time: number): Promise<{
    code: number;
  } | {
    canmsg: {
      ID: number;
      MSGTYPE: number;
      LEN: number;
      DATA: any[];
    };
    time: number;
  }[]>;

  swipeReq(_action: string, _screentype: string, _x: number, _y: number, _dx: number, _dy: number, _duration:number): Promise<{
    code: number;
  } | {
    canmsg: {
      ID: number;
      MSGTYPE: number;
      LEN: number;
      DATA: any[];
    };
    time: number;
  }[]>;

  touchscreenshotReq(_action: string): Promise<{
    code: number;
  } | {
    canmsg: {
      ID: number;
      MSGTYPE: number;
      LEN: number;
      DATA: any[];
    };
    time: number;
  }[]>;

  muSleep(activate: boolean): Promise<{
    code: number;
  } | {
    sleepStatus: boolean;
  }>;
}

export class BAPSim extends Base {
  connect(): Promise<boolean>;
  start(): Promise<boolean>;
  stop(): Promise<boolean>;
  reset(): Promise<boolean>;
  init(fileName: string): Promise<any[]>
  getState(): Promise<{
    Status: boolean;
    CarModel: string;
    Config: string;
    isInited: boolean;
    LSGParams: object;
  }>;
  getLSGList(): Promise<any[]>;
  setData(lsgID: number, fctID: number, data: number[]): Promise<{ code: number }>;
  sendReq(lsgID: number, fctID: number, opCode: number, data: number[]): Promise<{ code: number }>;
  switchLSG(lsgID: number, state: boolean): Promise<{ code: number }>;
  loadConfig(fileName: string): Promise<any>;
  startBAPCopy(isCopyTx: boolean): Promise<boolean>;
  stopBAPCopy(): Promise<boolean>;
}

export class CANSim extends Base {
  init(fileName: string): Promise<{
    dbc: object,
    control: object,
    data: object,
    name: string,
    favList: any[]
  }>;
  start(): Promise<boolean>;
  stop(): Promise<boolean>;
  reset(): Promise<{ code: number }>;
  setCycle(canID: number): Promise<{ code: number }>;
  setCycleByCount(canID: number, count: number): Promise<{ code: number }>;
  delCycle(canID: number): Promise<{ code: number }>;
  setCycleTime(canID: number, time: number): Promise<{ code: number }>;
  setData(canID: number, data: number[]): Promise<{ code: number }>;
  setDataByName(canID: number, name: string, value: number): Promise<{ code: number }>;
}

export class CARDiagnose extends Base {
  sendRaw(sub: string, dataArr: number[], canID: number): Promise<{ raw: number[] }>;
  getDTC(sub: string, id: number, canID: number): Promise<{
    raw: number[],
    header: number[],
    payload: number[],
    isError: boolean
  }>;
  getDID(sub: string, id: number, canID: number): Promise<{
    raw: number[],
    header: number[],
    payload: number[],
  }>;
  writeDID(sub: string, id: number, dataArr: number[], canID: number): Promise<{
    raw: number[],
    header: number[],
    payload: number[],
  }>;
}

export class CARSetting extends Base {
  setTemperature(value: number): Promise<{ result: object }>;
  activeInteriorlightProfile(profileNumber: number): Promise<{ result: object }>;
}

export class TestService extends BaseSocket {
  loadTestCase(tasklist: { id: string|number, filename: string }[]): Promise<{ index: number }>;
  loadTestCaseData(tasklist: object[]): Promise<{ index: number }>;
  getTestCaseList(): Promise<{
    taskList: object[],
    currentScriptIndex: number
  }>;
  deleteTestCase(ID?: string|number): Promise<{ code: number }>;
  /**
   * @deprecated use deleteTestCase()
   * @returns {Promise<{ code: number }>}
   * @memberof TestService
   */
  deleteAllTestCases(): Promise<{ code: number }>;
  start(): Promise<{ status: string }>;
  stop(): Promise<{ status: string }>;
  /**
   * @todo implementation
   * @returns {Promise<any>}
   * @memberof TestService
   */
  pause(): Promise<any>;
  resume(): Promise<{ status: string }>;
  setBenchConfig(benchConfig: {
    softwareVersion: string,
    leftSteering: string
  }): Promise<{
    softwareVersion: string,
    leftSteering: boolean
  }>;
  getBenchConfig(): Promise<{
    softwareVersion: string,
    leftSteering: boolean
  }>;
  setTestConfig(testConfig: {
    testLevelSDS: string,
    reportLevel: string,
  }): Promise<{
    testLevelSDS: string,
    reportLevel: string,
  }>;
  getTestConfig(): Promise<{
    testLevelSDS: string,
    reportLevel: string,
  }>;
  uploadTestcase(dirname: string, filename: string, caseFile: Readable): Promise<any>;
}

export class VoiceService extends Base {
  play(db: string, text: string): Promise<{ result: any }>;
  record(db: string, text: string): Promise<{
    db: string,
    text: string,
    result: any
  }>;
  recordAudiTTS(text: string): Promise<{
    text: string,
    result: any
  }>;
  checkVoice(db: string, text: string): Promise<{ result: any }>;
  deleteVoice(db: string, text: string): Promise<{
    db: string,
    text: string,
    result: any
  }>;
  deleteAllVoice(db: string): Promise<{
    db: string,
    result: any
  }>;
}
