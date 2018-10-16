const swag = require('../../../dist/bundle.cjs');
let mu = new swag.AudiMainUnit({host: '192.168.178.49'});
(async () => {
  try {
    let conn = await mu.connect();
    console.log(conn);
      // let res = await ts.assertESOTrace({
      //   channelID: '7599',
      //   keyword: 'BIG_COMMAND_DISPLAY',
      //   timeout: 30000
      // })
    // let res = await mu.getCurrentScreenID();
    // console.log(res);
    // //res = mu.cmdSingleSpeak('哈哈哈')
    // //console.log(res);
    // res = await mu.getWidgetInfosOfCurrentScreen();
    // console.log(res);
    let res = await mu.getVersionInfo();
    console.log(res)
  } catch (error) {
    console.log(error)   
  }
})();