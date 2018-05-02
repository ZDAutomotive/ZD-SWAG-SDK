const logParser = require('./logParser.js')

// module.exports.startFVParse = function (filename) {
//     let ev = logParser.listen()
//     logParser.startFVParse(filename)
//     ev.on('PARSED', console.log)
//     ev.on('DONE', ()=>{
//         console.logParser('FINISHED')
//     })
// }

// module.exports.evTest = function (filename) {
//     let ev = logParser.listen()
//     logParser.startEVParse(filename)
//     ev.on('PARSED', console.log)
//     ev.on('DONE', ()=>{
//         console.log('FINISHED')
//     })
// }

if (process.argv.length <= 2) {
	console.log("no specified LOG file");
} else {
	let logFile = __dirname + '/' + process.argv[2];

    let log = logParser.listen()
    logParser.startFVParse(logFile)
    log.on('PARSED', data=>{
        console.dir(data, {depth:null})
    })
    log.on('DONE', ()=>{
        console.log('FINISHED')
    })    
}

