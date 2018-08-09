const swag = require('../../../dist/bundle.cjs');
const cs = new swag.CARSetting({host:'172.16.248.248'});

(async () => {
    try {
      let conn = await cs.connect();
      console.log(conn);
      let res = await cs.setTemperature(19.5)
      console.log(res);
      let lightres = await cs.activeInteriorlightProfile(4)
      console.log(lightres);
    } catch (error) {
      console.log(error)
    }
  })();
