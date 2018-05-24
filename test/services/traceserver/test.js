const swag = require('../../../dist/bundle.cjs');

let ts = new swag.TraceServer({
  host: '192.168.178.49'
});

// (async () => {
//   try {
//     let conn = await ts.connect();
//     console.log(conn);
//     // let res = await ts.assertESOTrace({
//     //   channelID: '7599',
//     //   keyword: 'BIG_COMMAND_DISPLAY',
//     //   timeout: 30000
//     // })
//     let res = await ts.subscribe('testSERIALss', 'SERIAL', '');
//     ts.socket.on('testSERIALss', data => {
//       let msg = data.data.data;
//       //console.log(data);
//       let regHB = /(\d\d:\d\d:\d\d)\s?HB:\s?T=(\d*C),\s?CPU=(.*%),\s?Free mem=(\d*)MB/g;
//       let systemState = regHB.exec(msg);
//       if(systemState){
//         let record = {
//           type: 'systemState',
//           timestamp: data.timestamp,
//           cpu: systemState[3],
//           temp: systemState[2],
//           memory_free: systemState[4],
//           system_time: systemState[1],
//           trace: msg
//         }
//         console.log(record);
//       }
//       if(msg.indexOf('memmonit')!==-1) console.log(msg);
//       let regProcess = /\s?memmonit: top\s#(\s?\d\d?) pid=\s*\d*\s([\/a-zA-Z.-0-9]*)\s*size\s*=\s*(.*\))/g;
//       let processStatus = regProcess.exec(msg);
//       if(processStatus) {
//         let record = {
//           type: 'processStatus',
//           timestamp: data.timestamp,
//           number: processStatus[1],
//           name: processStatus[2],
//           size: processStatus[3],
//           trace: msg
//         }
//         console.log(record);
//       }
//       //console.log(systemState);
//     });
//     //console.log(res);
//   } catch (error) {
//     console.log(error)   
//   }

// })();

//test subscribe eso trace
// // (async () => {
// //   try {
// //     let conn = await ts.connect();
// //     console.log(conn);
// //     let res = await ts.subscribe('testesoss', 'eso', '{"esotext"=="ask_global_pardon"}');
// //     ts.socket.on('testesoss', data => {
// //       console.log(data)
// //       let msg = data.data.msgData.data.msgData.data;
// //       console.log(msg);
// //     });
// //     setTimeout(async () => {let res = await ts.unsubscribe('testesoss');
// //     console.log(res);
// //     await ts.unsubscribe('testesoss')}, 3000, null);
// //     console.log(res);
// //   } catch (error) {
// //     console.log(error)   
// //   }

// // })();

(async () => {
  try {
    let conn = await ts.connect();
    console.log(conn);
    let res = await ts.assertMultiESOTraces({
      timeout: 200000,
      before: 2000
    }, [{
      keyword: 'ready',
      singleReturn: false
    }])
    console.log(res);
    // res = await ts.assertMultiESOTraces({
    //   timeout: 200000,
    //   before: 20000
    // }, [{
    //   keyword: 'ask_global_pardon',
    //   singleReturn: false
    // },{
    //   keyword: 'FN_NAVI_CALCROUTE_STARTGUIDANCE_CB',
    //   singleReturn: true
    // },
    //   {
    //     singleReturn: true,
    //   //keyword: 'navi_ask_enter_home_address_VP_PROMPT'
    //   keyword: 'navi_info_route_guidance_to_destination_started_VP_PROMPT'
    // }])
    // console.log(res);
  } catch (error) {
    console.log(error)
  }
})();

// (async () => {
//   try {
//     let conn = await ts.connect();
//     console.log(conn);
//     let res = await ts.assertMultiESOTraces({
//       timeout: 20000
//     }, [{
//       keyword: 'beep_start.wav',
//     }, {
//       keyword: 'READY_FOR_INPUT'
//     }])
//     console.log(res);
//   } catch (error) {
//     console.log(error)
//   }
// })();