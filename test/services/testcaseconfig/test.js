const fs = require('fs')
const swag = require('../../../dist/bundle.cjs');
const TCC = new swag.TestcaseConfig({host:'192.168.1.3'});

(async () => {
    try {
      let conn = await TCC.connect();
      console.log(conn);

      let res = await TCC.getCfg()
      console.log(res.data);

      let res1 = await TCC.setCfg({test:'test111'})
      console.log(res1)

      // let res2 = await TCC.downloadCfg()
      // console.log(res2.headers['content-disposition'].filename)

      // let res3 = await TCC.uploadCfg(fs.createReadStream('/home/glb/Code/TCconfig/testcasecfg.json'))
      // console.log(res3)
    } catch (error) {
      console.log(error)
    }
  })();
