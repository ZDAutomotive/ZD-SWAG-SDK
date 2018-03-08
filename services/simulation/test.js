const RemotepanelClient = require("./index.js");

let remotepanel = new RemotepanelClient({port:6006, host:'192.168.178.71'})

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
    console.log(await remotepanel.connect())
    await remotepanel.touchReq(
        {
            screentype: 1,
            x: 500, 
            y: 300
        }
    )
}
test()