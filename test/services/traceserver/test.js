const swag = require('../../../dist/bundle.cjs');

// let mu = new swag.AudiMainUnit({});
// mu.connect().then(async () => {
//   try{
//     let res = await mu.resetWithPersistence();
//     console.log(res);
//   } catch (e) {
//     console.log(e);
//   }

// })

let ts = new swag.TraceServer({
  host: '192.168.178.49'
});

(async () => {
  try {
    let conn = await ts.connect();
    console.log(conn);
    // let res = await ts.assertESOTrace({
    //   channelID: '7599',
    //   keyword: 'BIG_COMMAND_DISPLAY',
    //   timeout: 30000
    // })
    let res = await ts.subscribe('testSERIALss', 'SERIAL', '');
    ts.socket.on('testSERIALss', data => {
      let msg = data.data.data;
      //console.log(data);
      let regHB = /(\d\d:\d\d:\d\d)\s?HB:\s?T=(\d*C),\s?CPU=(.*%),\s?Free mem=(\d*)MB/g;
      let systemState = regHB.exec(msg);
      if(systemState){
        let record = {
          type: 'systemState',
          timestamp: data.timestamp,
          cpu: systemState[3],
          temp: systemState[2],
          memory_free: systemState[4],
          system_time: systemState[1],
          trace: msg
        }
        console.log(record);
      }
      if(msg.indexOf('memmonit')!==-1) console.log(msg);
      let regProcess = /\s?memmonit: top\s#(\s?\d\d?) pid=\s*\d*\s([\/a-zA-Z.-0-9]*)\s*size\s*=\s*(.*\))/g;
      let processStatus = regProcess.exec(msg);
      if(processStatus) {
        let record = {
          type: 'processStatus',
          timestamp: data.timestamp,
          number: processStatus[1],
          name: processStatus[2],
          size: processStatus[3],
          trace: msg
        }
        console.log(record);
      }
      //console.log(systemState);
    });
    //console.log(res);
  } catch (error) {
    console.log(error)   
  }

})();