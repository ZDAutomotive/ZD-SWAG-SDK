const fs = require('fs')
const path = require('fs')
const Leopaard = require('../../../services/leopaard')

const executor = new Leopaard.Executor({ host: 'localhost', port: 9008 })
const tboxSimulator = new Leopaard.TboxSimulator({ host: 'localhost', port: 9008 })
const tspSimulator = new Leopaard.TspSimulator({ host: 'localhost', port: 9008 })

// const script = fs.readFileSync('./tbox-fsm.js')
// //console.log('script', script.toString('utf8'))

// executor.run(script.toString('utf8'), (failed, result) => {
//     console.log(result)
// })

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
        tspSimulator.send(unlockMessage, (failed, result)=>{
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