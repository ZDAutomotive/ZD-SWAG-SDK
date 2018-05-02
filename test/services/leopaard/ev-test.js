const Leopaard = require('../../../services/leopaard')
const tboxFsm = require('./tbox-fsm.js')

const leopaard = new Leopaard({ host: 'localhost', port: 6011 })
const tboxSimulator = leopaard.newTboxSimulator()
const tspSimulator = leopaard.newTspSimulator()

var context = {}

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

tspSimulator.start({ hostname: 'localhost', port: 8888 }, (flag, result) => {
    if (flag) {
        console.log('TSP Simulator started!')
    } else {
        console.error('failed to start TSP Simulator')
    }
})

tboxSimulator.connect({ hostname: 'localhost', port: 8888 }, (flag, result) => {
    if (flag) {
        setTimestamp(unlockMessage.data.timestamp)
        tspSimulator.send(unlockMessage, (flag, result) => {
            if (flag) {
                console.log('TSP: sent UNLOCK request to TBOX')
            } else {
                console.log('TSP: failed to send UNLOCK request to TBOX')
            }
        })
    } else {
        console.error('TBOX: failed to connect to TSP')
    }
})

setTimeout(tboxSimulator.disconnect.bind(tboxSimulator), 2000, (flag, result) => {
    console.log('tboxSimulator.disconnect() called!')
})

setTimeout(tspSimulator.stop.bind(tspSimulator), 2500, (flag, result) => {
    console.log('tspSimulator.stop() called!')
})

setTimeout(leopaard.finish.bind(leopaard), 3000, () => {
    console.log('leopaard.finish() called!')
})

// send response message
tboxSimulator.listen().on('message', async message => {
    console.log('TBOX RECV:', message)

    let response = await tboxFsm.evMessageProcess(message, context)
    if (response) {
        setTimestamp(response.data.timestamp)
        tboxSimulator.send(response, (flag, result) => {
            if (flag) {
                console.log(`TBOX: sent ${response.TYPE} response to TSP`)
            } else {
                console.log(`TBOX: failed to send ${response.TYPE} response to TSP`)
            }
        })
    }
})

tspSimulator.listen().on('message', message => {
    console.log('TSP RECV:', message)
})
