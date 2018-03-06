var chai = require('chai');
var canDPI = require('../../../utils/can/dpi').default;

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
  it('parse can msg params', (done) => {
    const canmsg = {
      DATA: [0x07, 0xA0, 0x00, 0x11, 0x10, 0x68, 0x35, 0xFD]
    }

    const signature = '0x07A0001110000000'
    const params = [{
      name: 'x',
      pos: 18,
      len: 10,
      value: 0,
    }, {
      name: 'y',
      pos: 8,
      len: 10,
      value: 0,
    }]
    const result = canDPI.parse(canmsg, signature, params)
    result.should.be.a('array').have.property('length').eql(2)
    result[0].name.should.be.a('string').eql('x')
    result[0].val.should.be.a('number').eql(26)
    result[1].name.should.be.a('string').eql('y')
    result[1].val.should.be.a('number').eql(53)

    done()
  })
})