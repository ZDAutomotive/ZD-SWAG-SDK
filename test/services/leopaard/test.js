const fs = require('fs')
const path = require('fs')
const Leopaard = require('../../../services/leopaard')

const Simulation = require('../../../services/simulation').default
console.log(Simulation)
const simulation = new Simulation()
var cansim = null

// CAUTION: run the below CLI command under ZD-SWAG-SDK folder
// npx cross-env BABEL_ENV=test mocha -re babel-core/register test/services/leopaard/test.js

simulation.connect()
    .then(() => {
        cansim = simulation.CANSim
        console.log('connected to Simulation')
    }).catch(err => {
        console.log('failed to call CAN Simulation', err)
    })


const leopaard = new Leopaard({ host: 'localhost', port: 6011 })
const tboxSimulator = leopaard.newTboxSimulator()
const tspSimulator = leopaard.newTspSimulator()

let unlockMessage = {
    startDelimiter: 11822,
    command: 130,
    response: 254,
    ICCID: [137, 134, 1, 22, 98, 113, 0, 23, 65, 148],
    encryptionMethod: 0,
    serialNO: 23,
    dataLength: 10,
    CRC: 0,
    data:
        {
            timestamp: [17, 5, 23, 11, 45, 3],
            id: 128,
            command: 1,
            param: [1] //中控锁控制指令 0:表示无动作 1:表示开锁 2:表示关锁
        }
}

function setTimestamp(timestamp) {
    let d = new Date()
    timestamp[0] = Number(d.getFullYear().toString().slice(-2))
    timestamp[1] = d.getMonth() + 1
    timestamp[2] = d.getDate()
    timestamp[3] = d.getHours()
    timestamp[4] = d.getMinutes()
    timestamp[5] = d.getSeconds()
}

tspSimulator.start({ hostname: 'localhost', port: 8888 }, (failed, result) => {
    if (!failed) {
        console.log('TSP Simulator started!')
    } else {
        console.error('failed to start TSP Simulator')
    }
})

tboxSimulator.connect({ hostname: 'localhost', port: 8888 }, (failed, result) => {
    if (!failed) {
        setTimestamp(unlockMessage.data.timestamp)
        tspSimulator.send(unlockMessage, (failed, result) => {
            if (!failed) {
                console.log('TSP: sent unlock request to TBOX')
            } else {
                console.log('TSP: failed to send unlock request to TBOX')
            }
        })
    } else {
        console.error('TBOX: failed to connect to TSP')
    }
})

setTimeout(tboxSimulator.disconnect.bind(tboxSimulator), 2000, (failed, result) => {
    console.log('tboxSimulator.disconnect() called')
})

setTimeout(tspSimulator.stop.bind(tspSimulator), 2500, (failed, result) => {
    console.log('tspSimulator.stop() called!')
})

// send response message
tboxSimulator.listen().on('message', async message => {
    console.log('TBOX RECV:', message)
    await tboxMessageProcess(message)
})

tspSimulator.listen().on('message', message => {
    console.log('TSP RECV:', message)
})

async function tboxMessageProcess(message) {
    switch (message.command) {
        case 0x02://实时信息上报 上行
        case 0x04://心跳 上行
        case 0x05://补发信息上报 上行
        case 0x06://登陆 上行
        case 0x07://退录 上行
        case 0x08://远程升级 上行
        case 0x80://参数查询命令 下行
        case 0x81://参数设置命令 下行
            break

        case 0x82://车载终端控制命令 下行
            let responseMessage = await tboxHandleTerminalControlMessage(message, context)
            if (responseMessage) {
                tboxSimulator.send(responseMessage, (failed, result) => {
                    if (!failed) {
                        console.log('TBOX: sent unlock response to TSP')
                    } else {
                        console.log('TBOX: failed to send unlock response message to TSP')
                    }
                })
            }

        case 0x83://链路连接 上行
        case 0x84://信息绑定 上行
        case 0x85://大数据上传 上行
        case 0x86://POI 数据查询 上行
            break
    }
    return null
}

async function tboxHandleTerminalControlMessage(message, context) {
    let response = message
    switch (message.data.command) {
        case 1:
            //send CAN MSG to unlock the door
            try {
                if (message.data.param[0] == 1 && context.cansim) {
                    if (await context.cansim.start()) {
                        await context.cansim.setDataByName(0x52d, 'TBOX_RemoteBCMControlLockReq', 1)
                        await context.cansim.setCycleTime(0x52d, 0)
                    }
                    //send CAN MSG to lock the door
                } else if (message.data.param[0] == 2 && context.cansim) {
                    if (await context.cansim.start()) {
                        await context.cansim.setDataByName(0x52d, 'TBOX_RemoteBCMControlLockReq', 2)
                        await context.cansim.setCycleTime(0x52d, 0)
                    }
                } else { }
                response.response = 1
                response.data.result = 0
            } catch (err) {
                response.response = 2
                response.data.result = 1
            }

            response.dataLength += 2
            setTimestamp(response.data.timestamp)
            return response;

        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            break
    }
    return null
}
