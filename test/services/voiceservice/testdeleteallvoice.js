const swag = require('../../../dist/bundle.cjs');
const vs = new swag.VoiceService({host:'192.168.178.49', port: 6015});

(async () => {
    try {
      let conn = await vs.connect();
      console.log(conn);
      let deleteRes = await vs.deleteAllVoice('audiTTS');
      console.log(deleteRes);
    } catch (error) {
      console.log(error)
    }
  })();