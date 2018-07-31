const swag = require('../../../dist/bundle.cjs');
const SC = new swag.SeatControl({host:'192.168.1.175'});

(async () => {
    try {
      let conn = await SC.connect();
      console.log(conn);

//      let res = await SC.setPosition([32710,32590,32730,32875])
//      console.log(res);
      let res2 = await SC.resetPosition()
      console.log(res2);
    } catch (error) {
      console.log(error)
    }
  })();
