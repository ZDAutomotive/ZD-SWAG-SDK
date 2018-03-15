import AndroidProberProxy from './android-prober-proxy/index'
import TraceServer from './trace-server/index'
import TTS from './tts/index'
import MainUnit from './audi-mainunit/index'
import CANTrace from './can-trace'
import Simulation from './simulation/index'
import TestService from './testservice/index'

export default {
  AndroidProberProxy,
  TraceServer,
  TTS,
  AudiMainUnit: MainUnit,
  CANTrace,
  Simulation,
  TestService
};
