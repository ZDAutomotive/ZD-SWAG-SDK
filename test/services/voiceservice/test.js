const swag = require('../../../dist/bundle.cjs');
const vs = new swag.VoiceService({host:'192.168.178.49', port: 6015});

(async () => {
    try {
      let conn = await vs.connect();
      console.log(conn);
      let res = await vs.checkVoice('daimler', '你好奔驰');
      console.log(res);
      let playRes = await vs.play('daimler', '你好奔驰')
      console.log(res);
    } catch (error) {
      console.log(error)
    }
  })();