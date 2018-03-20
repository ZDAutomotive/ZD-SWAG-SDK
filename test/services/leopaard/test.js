const fs = require('fs')
const path = require('fs')
const Leopaard = require('../../../services/leopaard')

const executor = new Leopaard.Executor({ host: 'localhost', port: 9008 })
const tboxSimulator = new Leopaard.TboxSimulator({ host: 'localhost', port: 9008 })

const script = fs.readFileSync('./tbox-fsm.js')
//console.log('script', script.toString('utf8'))

executor.run(script.toString('utf8'), (failed, result) => {
    console.log(result)
})

tboxSimulator.connect({ hostname: 'localhost', port: 8888 }, (failed, result) => {
    console.log('connected!')
})

setTimeout(tboxSimulator.disconnect.bind(tboxSimulator), 1000, (flag)=>{
    console.log('disconnected!')
})