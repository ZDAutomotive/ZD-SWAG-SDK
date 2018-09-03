const swag = require('../../../dist/bundle.cjs');
const SC = new swag.SeatControl({host:'192.168.178.114'});

(async () => {
    try {
      let conn = await SC.connect();
      console.log(conn);
//      console.log(SC.socket);
      let res = await SC.setPosition([32440,33208,32261,32600])
      console.log(res);
//      let res2 = await SC.resetPosition()
//      console.log(res2);
    } catch (error) {
      console.log(error)
    }
  })();
