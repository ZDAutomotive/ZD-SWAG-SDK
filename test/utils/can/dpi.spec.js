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
  it('parse can msg params', (done) => {
    const canmsg = {
      DATA: [0x1A, 0x01, 0x27, 0x00]
    }

    const signature = '0x18012100'
    const params = [{
      pos: 3,
      len: 1,
      name: 'test1'
    }, {
      pos: 15,
      len: 9,
      name: 'test2'
    }]
    const result = canDPI.parse(canmsg, signature, params)
    result.should.be.a('array').have.property('length').eql(2)
    result[0].name.should.be.a('string').eql('test1')
    result[0].val.should.be.a('number').eql(1)
    result[1].name.should.be.a('string').eql('test2')
    result[1].val.should.be.a('number').eql(0x127)

    done()
  })
})