const swag = require('../../../dist/bundle.cjs');
const cs = new swag.CARSetting({host:'192.168.178.185'});

(async () => {
    try {
      let conn = await cs.connect();
      console.log(conn);
      let res = await cs.setTemperature(25)
      console.log(res);
      let lightres = await cs.activeInteriorlightProfile(1)
      console.log(lightres);
    } catch (error) {
      console.log(error)
    }
  })();
