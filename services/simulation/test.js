const RemotepanelClient = require("./index.js");

remotepanel = new RemotepanelClient()
remotepanel.connect()
// SDS KEY
remotepanel.keyReq(
    {
        keyid: 301, 
        keyboardid: 1
    }
)
remotepanel.touchReq(
    {
        x: 500, 
        y: 300
    }
)
remotepanel.dragReq(
    {
        x: 200, 
        y: 100,
        dx: 100,
        dy: 0
    }
)
remotepanel.touchscreenshotReq(
    {
        x:0,
        y:0
    }
)