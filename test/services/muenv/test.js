const swag = require('../../../dist/bundle.cjs');
let mu = new swag.AudiMainUnit({host: '192.168.178.71'});
(async () => {
  try {
    let conn = await mu.connect();
    console.log(conn);
      // let res = await ts.assertESOTrace({
      //   channelID: '7599',
      //   keyword: 'BIG_COMMAND_DISPLAY',
      //   timeout: 30000
      // })
    let res = await mu.getCurrentScreenID();
    console.log(res);
  } catch (error) {
    console.log(error)   
  }
})();