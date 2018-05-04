const fs = require('fs');
const path = require("path");
const stream = require('stream');
const blfConverter = require("./blf-converter/build/Release/blf-converter.node");
//const blfConverter = require("./blf-converter/build/Debug/blf-converter.node");

//return array of { DELAY:500, DIR:"Rx", CHANNEL:1, EVENT:"ACC", MSG:{"ID":81, "LEN":8, "DATA":[1,2,3,4,5,6,7,8]}} }
module.exports.readASC = function (module, tracefile, callback) {
	if (!fs.existsSync(tracefile)) {
		callback("unable to open the tracefile: " + tracefile, null);
		return false;
	}

	switch (module.toUpperCase()) {
		case "CAN":
			return readASCofCAN(tracefile, callback)
		case "LIN":
			return readASCofLIN(tracefile, callback)
		default:
			return callback("unrecognized MODULE type: " + module, null)
	}
}

function readASCofCAN(tracefile, callback) {
	fs.readFile(tracefile, (err, data) => {
		if (err) {
			callback("failed to read ASC file", null);
			return
		}

		const records = data.toString().split(/[\n\r?]/);
		if (records.includes("no internal events logged")) {
			return read_ASC_records("CAN", false, records, callback);
		} else if (records.includes("internal events logged")) {
			return read_ASC_records("CAN", true, records, callback);
		} else {
			return read_ASC_records("CAN", false, records, callback);
		}
	});
}

function readASCofLIN(tracefile, callback) {
	fs.readFile(tracefile, (err, data) => {
		if (err) {
			callback("failed to read ASC file", null);
			return
		}

		const records = data.toString().split(/[\n\r?]/);
		return read_ASC_records("LIN", false, records, callback)
		// if (records.includes("no internal events logged")) {
		// 	return read_ASC_records(false, records, callback);
		// } else if (records.includes("internal events logged")) {
		// 	return read_ASC_records_CAN(true, records, callback);
		// } else {
		// 	return read_ASC_records_CAN(false, records, callback);
		// }
	});
}

//return array of { DELAY:500, DIR:"Rx", CHANNEL:1, EVENT:"ACC", MSG:{"ID":81, "LEN":8, "DATA":[1,2,3,4,5,6,7,8]}} }
function read_ASC_records(module, event_flag, records, callback) {
	let msgList = [];
	records.forEach((record) => {
		let fields = record.split(/\s+/);
		fields = fields.filter((field) => {
			return field.trim() != "";
		});

		if (fields.length < 6)
			return;

		if (isNaN(fields[0]))
			return;

		let message = {};
		//message.DELAY 	= Number(fields[0]).toFixed(6);
		message.DELAY = Number(fields[0])
		message.DIR = fields[3];
		message.CHANNEL = Number(fields[1]);

		let msg = {};
		msg.LEN = parseInt(fields[5]);
		switch (module.toUpperCase()) {
			case 'CAN':
				if (event_flag) { // with EVENT
					msg.ID = parseInt(fields[fields.length - 1].replace("x", ""));
					message.EVENT = fields[2];
				} else { // witout EVENT
					msg.ID = parseInt(fields[2].replace("x", ""), 16);
				}

				// if (msg.ID > 2048) {
				// 	msg.MSGTYPE = 2;
				// } else {
				// 	msg.MSGTYPE = 0;
				// }
				break

			case 'LIN':
				msg.ID = parseInt(fields[2], 16)
				break

			default:
				msg.ID = parseInt(fields[2], 16)
				break
		}

		msg.DATA = [];
		let msgLenOffset = msg.LEN + 6;
		for (let index = 6; index < msgLenOffset; index++) {
			msg.DATA.push(parseInt(fields[index], 16));
		}

		message.MSG = msg;
		msgList.push(message);
	});

	callback(null, msgList);
}

//array of { DELAY:500, DIR:"Rx", CHANNEL: 1, MSG:{"ID":81, "LEN":8, "DATA":[1,2,3,4,5,6,7,8]}} }
module.exports.readBLF = function (module, tracefile, callback) {
	if (!fs.existsSync(tracefile)) {
		callback("unable to open the tracefile: " + tracefile, null);
		return false;
	}

	switch (module.toUpperCase()) {
		case "CAN":
		case "LIN":
			return blfConverter.read(module.toUpperCase(), tracefile, (err, msgList) => {
				callback(err, JSON.parse(msgList))
			});
		default:
			return callback("unrecognized MODULE type: " + module, null)
	}
}

///////////////////////////////////////////////////////////////////////
module.exports.writeASC = function (module, traceFile, messageList, callback) {
	switch (module.toUpperCase()) {
		case "CAN":
		case "LIN":
			return writeASCofCAN_LIN(module, traceFile, messageList, callback);

		default:
			callback("unknowned MODULE type: " + module, false)
			return
	}
}

//message_list format
//DELAY:500, DIR:"Rx", EVENT:null, CHANNEL:1, MSG:{"ID":81, "MSGTYPE":0, "LEN":8, "DATA":[1,2,3,4,5,6,7,8]}},
function writeASCofCAN_LIN(module, traceFile, messageList, callback) {
	if (!Array.isArray(messageList)) {
		console.log("input parameter shall be Array");
		callback('input parameter error', null)
		return false;
	}

	const asc_data = fs.createWriteStream(traceFile);

	// asc_data = asc_data.concat("date "+(new Date()).toLocaleString()+"\r\n");
	// asc_data = asc_data.concat("base hex timestamps absolute"+"\r\n");

	asc_data.write("date " + (new Date()).toLocaleString() + "\r\n")
	asc_data.write("base hex timestamps absolute" + "\r\n")

	if (messageList[0] && messageList[0].EVENT) {
		// asc_data = asc_data.concat("internal events logged"+"\r\n");
		asc_data.write("internal events logged" + "\r\n")
	} else {
		// asc_data = asc_data.concat("no internal events logged"+"\r\n");
		asc_data.write("no internal events logged" + "\r\n")
	}

	let leadspace = "   ";
	messageList.forEach(message => {

		let delay = message.DELAY.toFixed(6).toString() + " ";
		let channel = (message.CHANNEL ? message.CHANNEL.toString() : 0) + " ";

		let id = 0
		switch (module.toUpperCase()) {
			case 'CAN':
				id = (message.MSG.ID.toString(16)).toUpperCase();
				if (message.MSG.ID < 2048) {
					id += "             ";
				} else {
					id += "x            ";
				}
				id.substr(-11);
				break

			case 'LIN':
				id = message.MSG.ID + "             "
				id.substr(-11)
				break

			default:
				break
		}

		let direction = message.DIR + "   ";
		let length = "D " + message.MSG.LEN.toString();

		let data = "";
		message.MSG.DATA.forEach((elm, index) => {
			if (index >= message.MSG.LEN)
				return;
			data += " " + ("0" + elm.toString(16)).substr(-2).toUpperCase();
		});

		// asc_data = asc_data.concat(leadspace.concat(delay, channel, id, direction, length, data, "\r\n"));
		asc_data.write(leadspace.concat(delay, channel, id, direction, length, data, "\r\n"))
	});

	asc_data.end()
	if (callback && Object.prototype.toString.call(callback) === '[object Function]')
		asc_data.on('close', () => {
			callback(null, true)
		})

	return 0;
}
module.exports.writeBLF = function (module, traceFile, messageList, callback) {
	if (!Array.isArray(messageList)) {
		console.log("in CONVERTER.writeto_BLF(), input parameter shall be Array");
		callback('input parameter error', null)
		return null;
	}

	return blfConverter.write(module, traceFile, JSON.stringify(messageList), (flag) => {
		if (flag)
			callback(null, flag)
		else
			callback('failed to write BLF', flag)
	})

}


