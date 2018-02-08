export default {
  /**
   * Verify if a can msg match the signature
   * @param {Object} canmsg
   * @param {number[]} canmsg.DATA
   * @param {string} signature 
   * @returns {boolean} tell whether can msg match the signature
   */
  verify(canmsg, signature) {
    let sigArr;
    if (signature.startsWith('0b')) {
      // parse signature as binary string
      sigArr = signature.substring(2).match(/.{8}/g)
      sigArr = sigArr.map(elem => parseInt(elem, 2))
    } else if (signature.startsWith('0x')) {
      // parse signature as hex string
      sigArr = signature.substring(2).match(/.{2}/g)
      sigArr = sigArr.map(elem => parseInt(elem, 16))
    } else {
      return false
    }

    const { DATA } = canmsg
    return DATA.every((elem, idx) => (elem & sigArr[idx]) === sigArr[idx])
  },
  /**
   * Parse a canmsg data matching signature
   * @param {Object} canmsg
   * @param {number[]} canmsg.DATA
   * @param {string} signature
   * @param {Object[]} params
   * @returns {Object[]} param name with value
   */
  parse(canmsg, signature, params) {
    if(!this.verify(canmsg, signature)) return []
    
    const ret = []
    params.forEach(param => {
      const { pos, len, name } = param
      // calc bit pos -> bytes pos
      let bytePos = Math.trunc(pos / 8)
      let bitInByte = pos % 8
      let restLen = len
      let val = 0
      while (restLen > 0) {
        const currLen = 8 - bitInByte
        if (currLen >= restLen) {
          const mask = (Math.pow(2, restLen) - 1) << (currLen - restLen)
          val <<= restLen
          val += (canmsg.DATA[bytePos] & mask) >> (currLen - restLen)
          break
        } else {
          const mask = (Math.pow(2, currLen) - 1)
          val <<= currLen
          val += canmsg.DATA[bytePos] & mask
          restLen -= currLen
          bytePos += 1
          bitInByte = 0
        }
      }
      ret.push({
        name,
        val
      })
    })

    return ret
  }
}