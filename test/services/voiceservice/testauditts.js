const swag = require('../../../dist/bundle.cjs');
const vs = new swag.VoiceService({host:'192.168.178.49', port: 6015});

setInterval(async () => {
  try {
    let conn = await vs.connect();
    console.log(conn);
    let deleteRes = await vs.deleteVoice('audiTTS', '自动切换地图颜色');
    console.log(deleteRes);
    let res = await vs.checkVoice('audiTTS', '自动切换地图颜色');
    console.log(res);
    if(!res.result.res) {
      let recordRes = await vs.recordAudiTTS('自动切换地图颜色');
      console.log(recordRes);
    }
    await vs.play('audiTTS', '自动切换地图颜色')
  } catch (error) {
    console.log(error)
  }
}, 12000)

// (async () => {
//     try {
//       let conn = await vs.connect();
//       console.log(conn);
//       let deleteRes = await vs.deleteVoice('audiTTS', '测试');
//       console.log(deleteRes);
//       let res = await vs.checkVoice('audiTTS', '测试');
//       console.log(res);
//       if(!res.result.res) {
//         let recordRes = await vs.recordAudiTTS('测试');
//         console.log(recordRes);
//       }
//       await vs.play('audiTTS', '测试')
//     } catch (error) {
//       console.log(error)
//     }
//   })();