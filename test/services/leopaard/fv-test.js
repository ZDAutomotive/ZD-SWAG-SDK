const Leopaard = require('../../../services/leopaard')
const tboxFsm = require('./tbox-fsm.js')

const leopaard = new Leopaard({ host: 'localhost', port: 6011 })
const tboxSimulator = leopaard.newTboxSimulator()
const tspSimulator = leopaard.newTspSimulator()

var context = {}

// const Simulation = require('../../../services/simulation').default
// const simulation = new Simulation()

// CAUTION: run the below CLI command under ZD-SWAG-SDK folder
// npx cross-env BABEL_ENV=test mocha -re babel-core/register ./test/services/leopaard/test.js

// simulation.connect()
//     .then(() => {
//         context.cansim = simulation.CANSim
//         console.log('connected to Simulation')
//     }).catch(err => {
//         console.log('failed to call CAN Simulation', err)
//     })

let loginMessage = {
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
            type: [76, 101, 111, 112, 97, 97, 114, 100, 45, 67, 83, 57],
            VIN: [76, 78, 56, 54, 71, 65, 65, 69, 49, 72, 65, 48, 54, 56, 50, 48, 49],
            version: [67, 48, 67, 57],
            code:
                {
                    vendorCode: [83, 71, 46, 76],
                    batchNO: [84, 68, 84, 66, 48, 49],
                    serialNO: 0
                }
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

async function unlockRun() {
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

    setTimeout(leopaard.finish.bind(leopaard), 3000, () => {
        console.log('leopaard.finish() called!')
    })

    let result = null
    let response = null
    try {
        response = await tspSimulator.start({ hostname: 'localhost', port: 8888 })
        console.log(response.data)

        setTimeout(tspSimulator.stop.bind(tspSimulator), 2500, (flag, result) => {
            console.log('tspSimulator.stop() called!')
        })
    } catch (err) {
        console.log(err)
        return
    }

    try {
        result = await tboxSimulator.connect({ hostname: 'localhost', port: 8888 })
        console.log(result)
        setTimeout(tboxSimulator.disconnect.bind(tboxSimulator), 2000, (flag, result) => {
            console.log('tboxSimulator.disconnect() called!')
        })
    } catch (err) {
        console.log(err)
        console.error('TBOX: failed to connect to TSP')
        return
    }

    try {
        setTimestamp(unlockMessage.data.timestamp)
        await tspSimulator.send(unlockMessage, (flag, result) => {
            if (flag) {
                console.log('TSP: sent UNLOCK request to TBOX')
            } else {
                console.log('TSP: failed to send UNLOCK request to TBOX')
            }
        })
    } catch (err) {
        console.log(err)
        return
    }

    //==================================================    
    // send response message
    tboxSimulator.listen().on('message', async message => {
        console.log('TBOX RECV:', message)

        let response = await tboxFsm.fvMessageProcess(message, context)
        if (response) {
            try {
                setTimestamp(response.data.timestamp)
                await tboxSimulator.send(response)
                console.log(`TBOX: sent ${response.TYPE} response to TSP`)
            } catch (err) {
                console.log(`TBOX: failed to send ${response.TYPE} response to TSP`)
            }
        }
    })

    tspSimulator.listen().on('message', message => {
        console.log('TSP RECV:', message)
    })

}

//=================run test=======================

unlockRun()



