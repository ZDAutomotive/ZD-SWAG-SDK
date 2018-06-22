const swag = require('../../../dist/bundle.cjs');
const canView = new swag.CANView({host:'192.168.178.110', port: 6010});

(async () => {
    try {
      let conn = await canView.connect();
      console.log(conn);
      let res = await canView.initCANBC('MLBevo_Gen1_MLBevo_ICAN_KMatrix_V8.15.11F_20180323_AM.json');
      console.log(res);
    //   let playRes = await canView.parse('daimler', '你好奔驰')
    //   console.log(res);
    } catch (error) {
      console.log(error)
    }
  })();