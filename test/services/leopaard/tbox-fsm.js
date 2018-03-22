
console.log('Leopaard Executor is running ...')


// emitter.on('message', (message) => {
//     //console.dir(message, {depth:null});
//     switch (message.command) {
//         case 0x04: {
//             let msg = heartBeat.handle(message);
//             if (msg) {
//                 emitter.emit('message', msg)
//             }
//         }
//         default: return;
//     }
// })

// module.exports.handle = function (message) {
//     console.log(message)
//     if (message.response == 0x01 || message.response == 0x02) {
//         console.log('RECV: heartBeat ack');
//     } else if (message.response == 0xFE) {
//         console.log('RECV: heartBeat and SEND: heartBeat ack');
//         message.response = 0x01;
//         message.serialNO += 1;
//         return message;
//     }
// }