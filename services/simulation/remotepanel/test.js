const SDK = require('../../../dist/bundle.cjs')
let remotepanel = new SDK.Simulation.Remotepanel({port:6006, host:'192.168.178.71'})
let cantrace = new SDK.CANTrace({port:6002, host:'192.168.178.71'})

// SDS KEY
// remotepanel.keyReq(
//     {
//         keyid: 301, 
//         keyboardid: 1
//     }
// )
// await remotepanel.touchReq(
//     {
//         screentype: 1,
//         x: 500, 
//         y: 300
//     }
// )
// remotepanel.dragReq(
//     {
//         screentype: 1,
//         x: 200, 
//         y: 200,
//         dx: 100,
//         dy: 0
//     }
// )
// remotepanel.touchscreenshotReq(
//     {
//         screentype: 1,
//         x:0,
//         y:0
//     }
// )
async function test() {
    await remotepanel.connect()
    await cantrace.connect()
    await cantrace.sendMultiCANMsgs('can2', await remotepanel.tapReq('ret','top',200,200))
}
test()