const fs = require('fs')
const path = require('fs')
const Leopaard = require('../../../services/leopaard')

const executor = new Leopaard({ host: 'localhost', port: 9008 })

const script = fs.readFileSync('./tbox-fsm.js')
console.log('script', script.toString('utf8'))

executor.run(script.toString('utf8'), (result) => {
    console.log(result)
})
