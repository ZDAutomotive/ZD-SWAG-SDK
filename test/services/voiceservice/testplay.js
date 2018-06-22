const swag = require('../../../dist/bundle.cjs');
const vs = new swag.VoiceService({host:'192.168.178.49', port: 6015});

(async () => {
    try {
      let conn = await vs.connect();
      console.log(conn);
      let res = await vs.checkVoice('audiTTS', '自动切换地图颜色');
      console.log(res);
      let playRes = await vs.play('audiTTS', '自动切换地图颜色')
      console.log(playRes);
    } catch (error) {
      console.log(error)
    }
  })();