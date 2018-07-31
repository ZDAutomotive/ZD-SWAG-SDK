import AndroidProberProxy from './android-prober-proxy/index'
import TraceServer from './trace-server/index'
import TTS from './tts/index'
import MainUnit from './audi-mainunit/index'
import CANTrace from './can-trace'
import BAPTrace from './bap-trace'
import Simulation from './simulation/index'
import TestService from './testservice/index'
import PowerSwitch from './power-switch/index'
import VoiceService from './voiceservice/index'
import CANView from './can-view/index'
import CARSetting from './individual-setting/index'
import SeatControl from './seat-control/index'

export default {
  AndroidProberProxy,
  TraceServer,
  TTS,
  AudiMainUnit: MainUnit,
  CANTrace,
  BAPTrace,
  Simulation,
  TestService,
  PowerSwitch,
  VoiceService,
  CANView,
  CARSetting,
  SeatControl
};
