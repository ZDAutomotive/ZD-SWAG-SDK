var chai = require('chai');
var canTrace = require('../../../services/can-trace').default;
var canClient

chai.should();

describe('Test CAN trace', () => {
  before((done) => {
    canClient = new canTrace({
      host: '192.168.178.71'
    })
    canClient.connect().then(() => done())
  })
  it('send multi trace', (done) => {
    const data = require('./chao.json')
    let accTime = 0
    let signalList = []
    for (let step of data.steps) {
      accTime += step.delay
      signalList = signalList.concat(
        step.action.args.signalList.map(signal => {
          accTime += signal.delay
          return {
            canbus: signal.canbus,
            canmsg: {
              ID: Number(signal.canid),
              LEN: signal.len,
              DATA: signal.data
            },
            time: accTime
          }
        })
      )
    }
    canClient.sendMultiCANMsgs(signalList)

    done()
  })
})
