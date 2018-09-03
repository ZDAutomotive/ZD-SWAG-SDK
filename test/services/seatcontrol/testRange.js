const swag = require('../../../dist/bundle.cjs');
const SC = new swag.SeatControl({host:'192.168.178.114'});

(async () => {
    try {
      let conn = await SC.connect();
      console.log(conn);
//      console.log(SC.socket);
      let res = await SC.setRange([32401,32196,32255,32539],[32696,33231,32754,32810]);
      console.log(res);
//      let res2 = await SC.resetPosition()
//      console.log(res2);
    } catch (error) {
      console.log(error)
    }
  })();
