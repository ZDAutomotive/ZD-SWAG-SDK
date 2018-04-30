const converter = require("./index.js")

var blf_filepath = "./AU492098402_2018-01-29_21-17-39_Data2F.blf"
var asc_filepath = "./canbus_01.asc"
var blf_output = "./outputtraces_01.blf"

var message_list = [
    { DELAY: 500, DIR: "Rx", CHANNEL: 1, MSG: { "ID": 181, "LEN": 4, "DATA": [1, 2, 3, 4] } },
    { DELAY: 1000, DIR: "Tx", CHANNEL: 1, MSG: { "ID": 182, "LEN": 8, "DATA": [8, 7, 6, 5, 4, 3, 2, 1] } },
    { DELAY: 1500, DIR: "Rx", CHANNEL: 1, MSG: { "ID": 183, "LEN": 4, "DATA": [1, 2, 3, 4] } },
    { DELAY: 2000, DIR: "Tx", CHANNEL: 1, MSG: { "ID": 184, "LEN": 8, "DATA": [8, 7, 6, 5, 4, 3, 2, 1] } },
    { DELAY: 2500, DIR: "Rx", CHANNEL: 1, MSG: { "ID": 185, "LEN": 4, "DATA": [1, 2, 3, 4] } },
    { DELAY: 3000, DIR: "Tx", CHANNEL: 1, MSG: { "ID": 186, "LEN": 8, "DATA": [8, 7, 6, 5, 4, 3, 2, 1] } },
];

converter.writeBLF("CAN", blf_output, message_list, (err, flag) => {
    if (err) {
        console.log(err)
    } else {
        console.log('write to BLF output trace file:', flag)
    }
})

setTimeout(() => {
    converter.readBLF("CAN", blf_output, (err, records) => {
        if (!err) {
            console.dir(records, { depth: null })
            converter.writeASC("CAN", "blf_to_asc.asc", records, (err) => {
                if (err) {
                    console.log('failed to rewrite to ASC file')
                    return
                }
                console.log('also write to ASC file')
            })
        } else {
            console.log('failed to read BLF file:', blf_output)
        }
    })
}, 2000);

// function readBLF(blf_filepath) {
//     converter.functions.read(blf_filepath,
//         function (err, blf_records) {
//             if (err) {
//                 console.log("ERROR: " + err);
//             } else {
//                 let trace_file = "canbus_0" + blf_records[0].CANBUS + ".asc"
//                 converter.functions.write(trace_file, blf_records,
//                     function (err) {
//                         if (err) {
//                             console.log("ERROR: " + err);
//                         } else {
//                             console.log("succeded to write to file: " + trace_file);
//                         }
//                     });
//             }
//         });
// }


