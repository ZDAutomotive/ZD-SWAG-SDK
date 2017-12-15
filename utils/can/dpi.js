module.exports = {
  /**
   * Verify if a can msg match the signature
   * @param {Object} canmsg
   * @param {number[]} canmsg.DATA
   * @param {string} signature 
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
   * @param {*} canmsg 
   * @param {*} signature 
   * @param {*} params 
   */
  parse(canmsg, signature, params) {}
}