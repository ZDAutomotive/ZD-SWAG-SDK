import { AxiosPromise } from 'axios';
import SocketIOClient from 'socket.io-client';

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
}

declare interface assertCANOption {
  signature: string;
  timeout: number;
  onFailed: boolean;
}

export class AndroidProberProxy {
  socket: SocketIOClient;
  constructor(option: Object);

  listen(): SocketIOClient;
  connect(): void;
}

export class TraceServer {
  port: number;
  host: string;
  constructor(option: BasicOption);
  connect(): Promise<number>;
  pull(start: number, end: number, modules: Array<string>): Promise<Array<Object>>;
  hook(eventName: string, filterString: string): AxiosPromise;
  removeHook(eventName: string): AxiosPromise;

  assertCAN(option: assertCANOption): Promise<any>;
  subscribe(name: string, type: string): boolean;
  unsubscribe(name: string): boolean;
  unsubscribeType(type: string): boolean;
  setFilter(filters: Array<Object>): AxiosPromise;
  getFilter(): Promise<Array<Object>>;
}

export class TTS {
  option: any;
  constructor(option: any);
  new(data: Object, cb: (isErr: boolean, data: any) => void);
  update(id: any, data: Object, cb: (isErr: boolean, data: any) => void);
  delete(id: any, cb: (isErr: boolean, data: any) => void);
  get(text: string, cb: (isErr: boolean, data: any) => void);
}

export class AudiMainUnit {
  port: number;
  host: string;
  constructor(option: BasicOption);
  connect(): Promise<number>;
  getVIN(): Promise<any>;
  getBackend(): Promise<any>;
  resetWithPersistence(): Promise<any>;
  setBackend(backend: string): Promise<any>;
}

export class CANTrace {
  port: number;
  host: string;
  constructor(option: BasicOption);
  connect(): Promise<number>;
  sendCANMsg(name: string, canmsg: Object): Promise<any>;
  sendMultiCANMsgs(name: string, canmsg: Array<Object>): boolean;
}

export interface ZDSWAGInstance {
  AndroidProberProxy: AndroidProberProxy;
  TraceServer: TraceServer;
  TTS: TTS;
  AudiMainUnit: AudiMainUnit;
  CANTrace: CANTrace
}

declare const ZDSWAG: ZDSWAGInstance;

export default ZDSWAG;