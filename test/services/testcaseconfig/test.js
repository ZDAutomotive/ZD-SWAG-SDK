const fs = require('fs')
const swag = require('../../../dist/bundle.cjs');
const TCC = new swag.TestcaseConfig({host:'192.168.1.100'});

(async () => {
    try {
      let conn = await TCC.connect();
      console.log(conn);

      // let res = await TCC.getCfg()
      // console.log(res.data);

      let res = await TCC.getBenchCfg()
      console.log(res);

      // let res1 = await TCC.setBenchCfg({carline222:'ABCDEf'})
      // console.log('set:',res1)

      // let res2 = await TCC.downloadBenchCfg()
      // console.log(res2.headers['content-disposition'],res2.data)

      // let res3 = await TCC.uploadBenchCfg(fs.createReadStream('/home/glb/upload/benchconfig.json'))
      // console.log(res3)
    } catch (error) {
      console.log(error)
    }
  })();
