var chai = require('chai');
var canDPI = require('../../../utils/can/dpi');

chai.should();

describe('CAN DPI', () => {
  it('verify can signature as hex string', (done) => {
    const canmsg = {
      DATA: [0x1A, 0x01, 0x27, 0x00]
    }

    const signature = '0x18012100'

    const result = canDPI.verify(canmsg, signature)
    result.should.be.a('boolean').eql(true)

    done()
  })
  it('verify can signature as binary string', (done) => {
    const canmsg = {
      DATA: [0x1A, 0x01, 0x27, 0x00]
    }

    const signature = '0b00011000000000000010001100000000'

    const result = canDPI.verify(canmsg, signature)
    result.should.be.a('boolean').eql(true)

    done()
  })
})