const fs = require('fs')
const path = require('fs')
const Leopaard = require('../../../services/leopaard')

const leopaard = new Leopaard({ host: 'localhost', port: 6011 })
const executor = leopaard.newExecutor()
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
    timestamp[1] = d.getMonth()+1
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
        console.log('connected!')
        
        setTimestamp(unlockMessage.data.timestamp)
        tspSimulator.send(unlockMessage, (failed, result) => {
            if (!failed) {
                console.log(result)
                console.log('sent unlock message to TBOX')
            }
        })
    } else {
        console.error('failed to connect')
    }
})

setTimeout(tboxSimulator.disconnect.bind(tboxSimulator), 2000, (failed, result) => {
    console.log('tboxSimulator.disconnect() called')
})

setTimeout(tspSimulator.stop.bind(tspSimulator), 2500, (failed, result) => {
    console.log('tspSimulator.stop() called!')
})

// send response message
tboxSimulator.listen().on('message', message => {
    console.log('TBOX RECV:', message)
})

tspSimulator.listen().on('message', message => {
    console.log('TSP RECV:', message)
})