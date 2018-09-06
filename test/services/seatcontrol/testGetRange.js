const swag = require('../../../dist/bundle.cjs');
const SC = new swag.SeatControl({host:'192.168.178.114'});

(async () => {
    try {
      let conn = await SC.connect();
      console.log(conn);

      let res3 = await SC.getRange()
      console.log(res3);
    } catch (error) {
      console.log(error)
    }
  })();
