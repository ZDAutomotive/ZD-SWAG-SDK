const converter = require("./index.js");
const fs = require("fs");

var message_list1 = [
	{ DELAY: 500, DIR: "Rx", CHANNEL: 1, MSG: { "ID": 181, "LEN": 8, "DATA": [1, 2, 3, 4, 5, 6, 7, 8] } },
	{ DELAY: 1000, DIR: "Tx", CHANNEL: 1, MSG: { "ID": 182, "LEN": 8, "DATA": [8, 7, 6, 5, 4, 3, 2, 1] } },
	{ DELAY: 1500, DIR: "Rx", CHANNEL: 1, MSG: { "ID": 183, "LEN": 8, "DATA": [1, 2, 3, 4, 5, 6, 7, 8] } },
	{ DELAY: 2000, DIR: "Tx", CHANNEL: 1, MSG: { "ID": 184, "LEN": 8, "DATA": [8, 7, 6, 5, 4, 3, 2, 1] } },
	{ DELAY: 2500, DIR: "Rx", CHANNEL: 1, MSG: { "ID": 185, "LEN": 8, "DATA": [1, 2, 3, 4, 5, 6, 7, 8] } },
	{ DELAY: 3000, DIR: "Tx", CHANNEL: 1, MSG: { "ID": 186, "LEN": 8, "DATA": [8, 7, 6, 5, 4, 3, 2, 1] } },
];

var output_tracefile = "traceoutput1.asc";
var input_tracefile = "canbus_01.asc";

// node test_canbc.js dbc_templates.json
// if (process.argv.length <= 2) {
// 	console.log("no external tracefiles specified, using default tracefiles");
// } else {
// 	var tracefile = __dirname + '/' + process.argv[2];
// 	
// }

// converter.readASC("CAN", input_tracefile, (err, records) => {
// 	console.dir(records, { depth: null })
// });

converter.writeASC("CAN", output_tracefile, message_list1, (err, flag) => {
	if (err) {
		console.log(err)
	} else {
		console.log('writeASC', flag)
	}
})
