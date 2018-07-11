const swag = require('../../../dist/bundle.cjs');
const cs = new swag.CARSetting({host:'localhost'});

(async () => {
    try {
      let conn = await cs.connect();
      console.log(conn);
      let res = await cs.setTemperature(21)
      console.log(res);
      let lightres = await cs.activeInteriorlightProfile(2)
      console.log(lightres);
    } catch (error) {
      console.log(error)
    }
  })();