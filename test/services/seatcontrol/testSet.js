const swag = require('../../../dist/bundle.cjs');
const SC = new swag.SeatControl({host:'192.168.1.175'});

(async () => {
    try {
      let conn = await SC.connect();
      console.log(conn);

      let res = await SC.setPosition([0x800A,0x803C,0X813B,0x801D])
      console.log(res);
//      let res2 = await SC.resetPosition()
//      console.log(res2);
    } catch (error) {
      console.log(error)
    }
  })();
