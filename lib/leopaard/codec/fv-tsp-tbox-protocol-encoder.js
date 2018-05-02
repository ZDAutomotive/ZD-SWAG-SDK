const DELIMITER = 0x2E2E;
const HEADER_LENGTH_WITH_CRC = 20;

//============================Encode Entry========================================
module.exports.encode = function (message) {
    let offset = 0;
    let buffer = Buffer.alloc(HEADER_LENGTH_WITH_CRC + message.dataLength);

    buffer.writeUInt16BE(message.startDelimiter, offset)
    offset += 2;

    buffer.writeUInt8(message.command, offset++);
    buffer.writeUInt8(message.response, offset++);

    for (let i = 0; i < message.ICCID.length; i++) {
        buffer.writeUInt8(message.ICCID[i], offset++);
    }

    buffer.writeUInt8(message.encryptionMethod, offset++)
    buffer.writeUInt16BE(message.serialNO, offset)
    offset += 2;

    buffer.writeUInt16BE(message.dataLength, offset);
    offset += 2;

    if (message.dataLength > 0) {
        switch (message.response) {
            case 0x01:
            case 0x02:
                offset += responseMessageEncode(message, buffer.slice(offset));
                break
            case 0xFE:
                offset += commandMessageEncode(message, buffer.slice(offset))
                break
            default:
                break
        }
    }

    //console.log(offset, 'byte(s) written')
    buffer[buffer.length - 1] = calculateCRC(buffer);
    return buffer;
}

function calculateCRC(buffer) {
    let crc = buffer[0] ^ buffer[1];
    for (let i = 2; i < buffer.length - 1; i++) {
        crc ^= buffer[i];
    }
    return crc;
}

// response encoder
function loginResponseEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }
    buffer.writeUInt16BE(message.result, offset);
    offset += 2;

    return offset;
}

function parameterGetResponseEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }
    // 参数个数
    buffer.writeUInt8(message.count, offset++);

    // 写入参数组
    for (let index = 0; index < message.count; index++) {
        //参数ID
        buffer.writeUInt8(message.params[index].id, offset++);
        // 参数内容
        switch (message.params[index].id) {
            case 0x0B://服务中心号码
            case 0x0C: //短信业务中心号码,上行号码
            case 0x0D: //短信业务中心号码,下行号码
            case 0x0E: //E-CALL 服务电话
            case 0x0F: //I-CALL 服务电话
            case 0x21: //HU 的 APN 参数信息
            case 0x22: //T-BOX 的 APN 参数信息
                for (let i = 0; i < message.params[index].data.length; i++) {
                    buffer.writeUInt8(message.params[index].data[i], offset++)
                }

                if (message.params[index].hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].result, offset);
                    offset += 2;
                }
                break

            case 0x10: //ACC 是否上报,0-关闭,1- 开启
            case 0x11: //休眠是否上报,0-关闭,1- 开启
            case 0x12: //关机是否上报,0-关闭,1- 开启
            case 0x13: //车身变化是否上报,0-关闭,1- 开启
            case 0x14: //故障是否上报,0-关闭,1- 开启
            case 0x18: //音响主机连接状态,0-关闭,1- 开启
            case 0x1E: //更新推送信息参数(需传送给 MP5) 0-不更新,1-更新
            case 0x20: //定时上报内容 查询/设置 0:表示普通定时上报;1:表示 UBI 数据上报
            case 0x23:  //PEPS 使能标志位0:禁止 PEPS 启动;1:允许 PEPS 启动(默认)
            case 0x24: //T-BOX 与 PEPS 本地认证使能标志位 0:车辆启动时禁止与 PEPS 进行安全认证 1:车辆启动时允许与 PEPS 进行安全认证
            case 0x25: //T-BOX 复位 3G 模块 0:不复位;1:复位
            case 0x26: //T-BOX 复位功能 0:不复位;1:复位
            case 0x27: //T-BOX 自动绑定功能 0:不动作;1:上报自动绑定报文
                buffer.writeUInt8(message.params[index].data, offset++)

                if (message.params[index].hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].result, offset);
                    offset += 2;
                }
                break

            case 0x16: //受控车辆配置结果
                buffer.writeUInt8(message.params[index].PEPS, offset++)
                buffer.writeUInt8(message.params[index].allow, offset++)

                if (message.params[index].hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].result, offset);
                    offset += 2;
                }
                break

            case 0x17: //数据采集信息
                buffer.writeUInt8(message.params[index].count, offset++)
                buffer.writeUInt16BE(message.params[index].duration, offset);
                offset += 2;
                for (let i = 0; i < message.params[index].data.length; i++) {
                    buffer.writeUInt16BE(message.params[index].data[i], offset)
                    offset += 2
                }

                if (message.params[index].hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].result, offset);
                    offset += 2;
                }
                break

            case 0x19: //定时上报信息,0-关闭,非 0-上报间隔,单位:秒
                buffer.writeUInt16BE(message.params[index].data, offset);
                offset += 2;

                if (message.params[index].hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].result, offset);
                    offset += 2;
                }
                break

            case 0x1A: //车辆终端信息,数据格式和定义见表 17
                for (let i = 0; i < message.params[index].softwareVersion.length; i++) {
                    buffer.writeUInt8(message.params[index].softwareVersion[i], offset++)
                }
                for (let i = 0; i < message.params[index].hardwareVersion.length; i++) {
                    buffer.writeUInt8(message.params[index].hardwareVersion[i], offset++)
                }
                for (let i = 0; i < message.params[index].VIN.length; i++) {
                    buffer.writeUInt8(message.params[index].VIN[i], offset++)
                }
                for (let i = 0; i < message.params[index].barcode.length; i++) {
                    buffer.writeUInt8(message.params[index].barcode[i], offset++)
                }
                for (let i = 0; i < message.params[index].productionDate.length; i++) {
                    buffer.writeUInt8(message.params[index].productionDate[i], offset++)
                }
                for (let i = 0; i < message.params[index].releaseDate.length; i++) {
                    buffer.writeUInt8(message.params[index].releaseDate[i], offset++)
                }
                for (let i = 0; i < message.params[index].updateDate.length; i++) {
                    buffer.writeUInt8(message.params[index].updateDate[i], offset++)
                }

                if (message.params[index].hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].result, offset);
                    offset += 2;
                }
                break

            case 0x1B: //主服务器网络参数,数据格式和定义见表 27
            case 0x1C: //从服务器网络参数,数据格式和定义见表 27
                buffer.writeUInt32BE(message.params[index].ip, offset);
                offset += 4;
                buffer.writeUInt16BE(message.params[index].port, offset);
                offset += 2;

                if (message.params[index].hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].result, offset);
                    offset += 2;
                }
                break

            case 0x1D: //一键导航目的地下发参数,数据格式见表 28
                buffer.writeUInt8(message.params[index].data.mothed, offset++)

                if (message.params[index].data.hasOwnProperty('dstPOI')) {
                    for (let i = 0; i < message.params[index].data.dstPOI.length; i++) {
                        buffer.writeUInt8(message.params[index].data.dstPOI[i], offset++)
                    }
                    buffer.writeUInt32BE(message.params[index].data.dstLatitude, offset);
                    offset += 4;
                    buffer.writeUInt32BE(message.params[index].data.dstLongitude, offset);
                    offset += 4;
                }
                if (message.params[index].data.hasOwnProperty('viaPOI1')) {
                    for (let i = 0; i < message.params[index].data.viaPOI1.length; i++) {
                        buffer.writeUInt8(message.params[index].data.viaPOI1[i], offset++)
                    }
                    buffer.writeUInt32BE(message.params[index].data.viaPOI1Latitude, offset);
                    offset += 4;
                    buffer.writeUInt32BE(message.params[index].data.viaPOI1Longitude, offset);
                    offset += 4;
                }
                if (message.params[index].data.hasOwnProperty('viaPOI2')) {
                    for (let i = 0; i < message.params[index].data.viaPOI2.length; i++) {
                        buffer.writeUInt8(message.params[index].data.viaPOI2[i], offset++)
                    }
                    buffer.writeUInt32BE(message.params[index].data.viaPOI2Latitude, offset);
                    offset += 4;
                    buffer.writeUInt32BE(message.params[index].data.viaPOI2Longitude, offset);
                    offset += 4;
                }
                if (message.params[index].data.hasOwnProperty('viaPOI3')) {
                    for (let i = 0; i < message.params[index].data.viaPOI3.length; i++) {
                        buffer.writeUInt8(message.params[index].data.viaPOI3[i], offset++)
                    }
                    buffer.writeUInt32BE(message.params[index].data.viaPOI3Latitude, offset);
                    offset += 4;
                    buffer.writeUInt32BE(message.params[index].data.viaPOI3Longitude, offset);
                    offset += 4;
                }

                if (message.params[index].data.hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].data.result, offset);
                    offset += 2;
                }
                break

            case 0x1F: //URL 数据信息,数据格式见表 26
                buffer.writeUInt8(message.params[index].data.textOrPicture, offset++)
                buffer.writeUInt8(message.params[index].data.allowPopup, offset++)
                for (let i = 0; i < message.params[index].data.data.length; i++) {
                    buffer.writeUInt8(message.params[index].data.data[i], offset)
                }

                if (message.params[index].data.hasOwnProperty('result')) {
                    buffer.writeUInt16BE(message.params[index].data.result, offset);
                    offset += 2;
                }
                break

            default:
                break
        }
    }
    return offset;
}


function remoteUpdateEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }
    // 命令 ID
    buffer.writeUInt16BE(message.command, offset);
    offset += 2;

    // 参数内容
    switch (message.command) {
        case 0x01:
            let offset = 0;
            for (let i = 0; i < message.ftpServer.length; i++) {
                buffer.writeUInt8(message.ftpServer[i], offset++)
            }

            buffer.writeUInt16BE(message.port, offset);
            offset += 2;

            for (let i = 0; i < message.account.length; i++) {
                buffer.writeUInt8(message.account[i], offset++)
            }
            for (let i = 0; i < message.password.length; i++) {
                buffer.writeUInt8(message.password[i], offset++)
            }
            for (let i = 0; i < message.fileName.length; i++) {
                buffer.writeUInt8(message.fileName[i], offset++)
            }

            buffer.writeUInt32BE(message.fileLength, offset);
            offset += 4;
            break

        case 0x11:
        case 0x12:
        case 0x02:
            buffer.writeUInt16BE(message.result, offset);
            offset += 2;
            break

        default:
            break
    }
    return offset;
}

function parameterSetResponseEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }
    buffer.writeUInt8(message.count, offset++)
    for (let i = 0; i < message.params.length; i++) {
        buffer.writeUInt8(message.params[i].id, offset++)
        buffer.writeUInt16BE(message.params[i].result, offset);
        offset += 2;
    }
    return offset;
}

//================= common encoder
function common_locationDataEncode(message, buffer) {
    let offset = 0;

    let status = 0;
    status |= message.status.validity
    status |= message.status.latitude << 1
    status |= message.status.longitude << 2
    status |= message.status.reserved << 3
    buffer.writeUInt8(status, offset++)

    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }

    buffer.writeUInt32BE(message.longitudeValue, offset);
    offset += 4;
    buffer.writeUInt32BE(message.latitudeValue, offset);
    offset += 4;
    buffer.writeUInt16BE(message.velocity, offset);
    offset += 2;
    buffer.writeUInt16BE(message.direction, offset);
    offset += 2;
    buffer.writeUInt16BE(message.altitude, offset);
    offset += 2;

    for (let i = 0; i < message.reserved.length; i++) {
        buffer.writeUInt8(message.reserved[i], offset++)
    }

    return offset;
}

function common_vehicleStatusEncode(message, buffer) {
    let offset = 0;

    let alarm = 0;
    alarm |= message.alarm.bit0//BIT0=1: 未定义
    alarm |= message.alarm.bit1 << 1//BIT1=1: 馈电报警
    alarm |= message.alarm.bit2 << 2//BIT2=1: 欠压报警
    alarm |= message.alarm.bit3 << 3//BIT3=1: 车辆胎压异常报警
    alarm |= message.alarm.bit4 << 4//BIT4=1: 碰撞报警
    alarm |= message.alarm.bit5 << 5//BIT5=1: 异动报警
    alarm |= message.alarm.bit6 << 6//BIT6=1: 盗警
    alarm |= message.alarm.bit7 << 7//BIT7=1: 车载终端主电被切断
    buffer.writeUInt8(alarm, offset++)

    let lamp = 0;
    lamp |= message.lamp.bit0
    lamp |= message.lamp.bit1_2 << 1
    lamp |= message.lamp.bit3 << 3
    lamp |= message.lamp.bit4 << 4
    lamp |= message.lamp.bit5 << 5
    lamp |= message.lamp.bit6 << 6
    lamp |= message.lamp.bit7 << 7
    buffer.writeUInt8(lamp, offset++)

    let door = 0;
    door |= message.door.bit0
    door |= message.door.bit1 << 1
    door |= message.door.bit2 << 2
    door |= message.door.bit3 << 3
    door |= message.door.bit4 << 4
    door |= message.door.bit5 << 5
    door |= message.door.bit6 << 6
    door |= message.door.bit7 << 7
    buffer.writeUInt8(door, offset++)

    let gear = 0;
    gear |= message.gear.D
    gear |= message.gear.R << 1
    gear |= message.gear.N << 2
    gear |= message.gear.P << 3
    buffer.writeUInt8(gear, offset++)

    let other = 0;
    other |= message.other.bit0
    other |= message.other.aircondition << 1
    other |= message.other.PEPS << 2
    other |= message.other.power << 3//BIT3-BIT5: 电源(0 : Off , 1 : Acc , 2 : On , 3 :Start)
    other |= message.other.bit6 << 6
    other |= message.other.airbag << 7
    buffer.writeUInt8(other, offset++)

    return offset;
}

function common_dashboardInfoEncode(message, buffer) {
    let offset = 0;
    buffer.writeUInt8(message.instantConsumption, offset++)

    buffer.writeUInt16BE(message.tripAFuelConsumption, offset)
    offset += 2
    buffer.writeUInt16BE(message.tripBFuelConsumption, offset)
    offset += 2
    buffer.writeUInt16BE(message.remainedFuel, offset)
    offset += 2

    for (let i = 0; i < message.totalMilage.length; i++) {
        buffer.writeUInt8(message.totalMilage[i], offset++)
    }

    buffer.writeUInt8(message.waterTemperature, offset++)

    buffer.writeUInt16BE(message.rotationSpeed, offset)
    offset += 2
    buffer.writeUInt16BE(message.velocity, offset)
    offset += 2
    buffer.writeUInt16BE(message.tripAMilage, offset)
    offset += 2
    buffer.writeUInt16BE(message.tripBMilage, offset)
    offset += 2

    buffer.writeUInt8(message.displayMode, offset++)
    buffer.writeUInt8(message.communicationSignal, offset++)

    return offset
}

function common_dashboardInfo2Encode(message, buffer) {
    let offset = 0
    for (let i = 0; i < message.totalMilage.length; i++) {
        buffer.writeUInt8(message.totalMilage[i], offset++)
    }
    return offset
}

function common_dashboardInfo3Encode(message, buffer) {

    let offset = common_dashboardInfoEncode(message, buffer)

    buffer.writeUInt8(message.frontleft_tyrepressure_valid, offset++)
    buffer.writeUInt8(message.frontleft_tyrepressure_status, offset++)
    buffer.writeUInt8(message.frontright_tyrepressure_valid, offset++)
    buffer.writeUInt8(message.frontright_tyrestatus_status, offset++)
    buffer.writeUInt8(message.rearleft_tyrepressure_valid, offset++)
    buffer.writeUInt8(message.rearleft_tyrepressure_status, offset++)
    buffer.writeUInt8(message.rearright_tyrepressure_valid, offset++)
    buffer.writeUInt8(message.rearright_tyrestatus_status, offset++)

    buffer.writeUInt8(message.frontleft_tyrepressure, offset++)
    buffer.writeUInt8(message.frontright_tyrestatus, offset++)
    buffer.writeUInt8(message.rearleft_tyrepressure, offset++)
    buffer.writeUInt8(message.rearright_tyrestatus, offset++)

    return offset;
}

function common_UBIEncode(message, buffer) {
    let offset = 0;
    buffer.writeUInt8(message.instantConsumption, offset++)

    buffer.writeUInt16BE(message.tripAFuelConsumption, offset)
    offset += 2
    buffer.writeUInt16BE(message.tripBFuelConsumption, offset)
    offset += 2
    buffer.writeUInt16BE(message.remainedFuel, offset)
    offset += 2

    for (let i = 0; i < message.totalMilage.length; i++) {
        buffer.writeUInt8(message.totalMilage[i], offset++)
    }

    buffer.writeUInt8(message.waterTemperature, offset++)

    for (let i = 0; i < message.rotationSpeed.length; i++) {
        buffer.writeUInt16BE(message.rotationSpeed[i], offset)
        offset += 2
    }
    for (let i = 0; i < message.velocity.length; i++) {
        buffer.writeUInt16BE(message.velocity[i], offset)
        offset += 2
    }
    for (let i = 0; i < message.wheelPosition.length; i++) {
        buffer.writeUInt16BE(message.wheelPosition[i], offset)
        offset += 2
    }
    for (let i = 0; i < message.wheelRotationSpeed.length; i++) {
        buffer.writeUInt16BE(message.wheelRotationSpeed[i], offset)
        offset += 2
    }
    for (let i = 0; i < message.accleration.length; i++) {
        buffer.writeUInt16BE(message.accleration[i], offset)
        offset += 2
    }
    for (let i = 0; i < message.gear.length; i++) {
        buffer.writeUInt8(message.gear[i], offset++)
    }
    buffer.writeUInt8(message.frontleft_tyrepressure_valid, offset++)
    buffer.writeUInt8(message.frontleft_tyrepressure_status, offset++)
    buffer.writeUInt8(message.frontright_tyrepressure_valid, offset++)
    buffer.writeUInt8(message.frontright_tyrestatus_status, offset++)
    buffer.writeUInt8(message.rearleft_tyrepressure_valid, offset++)
    buffer.writeUInt8(message.rearleft_tyrepressure_status, offset++)
    buffer.writeUInt8(message.rearright_tyrepressure_valid, offset++)
    buffer.writeUInt8(message.rearright_tyrestatus_status, offset++)

    buffer.writeUInt8(message.frontleft_tyrepressure, offset++)
    buffer.writeUInt8(message.frontright_tyrestatus, offset++)
    buffer.writeUInt8(message.rearleft_tyrepressure, offset++)
    buffer.writeUInt8(message.rearright_tyrestatus, offset++)

    return offset
}

function common_UBIVehicleEncode(message, buffer) {
    let offset = 0;

    let alarm = 0;
    alarm |= message.alarm.bit0//BIT0=1: 未定义
    alarm |= message.alarm.bit1 << 1//BIT1=1: 馈电报警
    alarm |= message.alarm.bit2 << 2//BIT2=1: 欠压报警
    alarm |= message.alarm.bit3 << 3//BIT3=1: 车辆胎压异常报警
    alarm |= message.alarm.bit4 << 4//BIT4=1: 碰撞报警
    alarm |= message.alarm.bit5 << 5//BIT5=1: 异动报警
    alarm |= message.alarm.bit6 << 6//BIT6=1: 盗警
    alarm |= message.alarm.bit7 << 7//BIT7=1: 车载终端主电被切断
    buffer.writeUInt8(alarm, offset++)

    let lamp = 0;
    lamp |= message.lamp.bit0
    lamp |= message.lamp.bit1_2 << 1
    lamp |= message.lamp.bit3 << 3
    lamp |= message.lamp.bit4 << 4
    lamp |= message.lamp.bit5 << 5
    lamp |= message.lamp.bit6 << 6
    lamp |= message.lamp.bit7 << 7
    buffer.writeUInt8(lamp, offset++)

    let door = 0;
    door |= message.door.bit0
    door |= message.door.bit1 << 1
    door |= message.door.bit2 << 2
    door |= message.door.bit3 << 3
    door |= message.door.bit4 << 4
    door |= message.door.bit5 << 5
    door |= message.door.bit6 << 6
    door |= message.door.bit7 << 7
    buffer.writeUInt8(door, offset++)

    let gear = 0;
    gear |= message.gear.bit0_3//BIT3-0 档位
    gear |= message.gear.bit4 << 4//BIT4 1:制动有效 0:制动无效
    gear |= message.gear.bit5 << 5//BIT5=1: 1:驱动有效 0:驱动无效
    gear |= message.gear.bit6 << 6//BIT6=1: 未定义
    gear |= message.gear.bit7 << 7//BIT7=1: 未定义
    buffer.writeUInt8(gear, offset++)

    let other = 0;
    other |= message.other.bit0
    other |= message.other.aircondition << 1
    other |= message.other.PEPS << 2
    other |= message.other.power << 3//BIT3-BIT5: 电源(0 : Off , 1 : Acc , 2 : On , 3 :Start)
    other |= message.other.bit6 << 6
    other |= message.other.airbag << 7
    buffer.writeUInt8(other, offset++)

}

function common_failureLampEncode(message, buffer) {
    let offset = 0
    buffer.writeUInt8(message.length, offset++)

    for (let i = 0; i < message.lamps; i++) {
        let lamp = 0;
        lamp |= message.lamps[i].bit0
        lamp |= message.lamps[i].bit1 << 1
        lamp |= message.lamps[i].bit2 << 2
        lamp |= message.lamps[i].bit3 << 3
        lamp |= message.lamps[i].bit4 << 4
        lamp |= message.lamps[i].bit5 << 5
        lamp |= message.lamps[i].bit6 << 6
        lamp |= message.lamps[i].bit7 << 7
        buffer.writeUInt8(lamp, offset++)
    }
    return offset
}

function common_vehicleReportTypeEncode(message, buffer) {
    let offset = 0
    buffer.writeUInt8(message.type, offset++)
    return offset
}

function common_configurationResultEncode(message, buffer) {
    let offset = 0
    buffer.writeUInt8(message.type, offset++)
    buffer.writeUInt8(message.allow, offset++)
    buffer.writeUInt16BE(message.result, offset)
    offset += 2
    return offset
}

function common_vehicleFailureEncode(message, buffer) {
    let offset = 0
    buffer.writeUInt16BE(message.length, offset)
    offset += 2

    for (let i = 0; i < message.failures.length; i++) {
        buffer.writeUInt8(message.failures[i].type, offset++)
        buffer.writeUInt16BE(message.failures[i].count, offset)
        offset += 2
        for (let j = 0; j < message.failures[i].codes.length; j++) {
            buffer.writeUInt8(message.failures[i].codes[j].code[0], offset++)
            buffer.writeUInt8(message.failures[i].codes[j].code[1], offset++)
            buffer.writeUInt8(message.failures[i].codes[j].code[2], offset++)
        }
    }
    return offset
}

function common_terminalInfoEncode(message, buffer) {
    let offset = 0
    for (let i = 0; i < message.softwareVersion.length; i++) {
        buffer.writeUInt8(message.softwareVersion[i], offset++)
    }
    for (let i = 0; i < message.hardwareVersion.length; i++) {
        buffer.writeUInt8(message.hardwareVersion[i], offset++)
    }
    for (let i = 0; i < message.VIN.length; i++) {
        buffer.writeUInt8(message.VIN[i], offset++)
    }
    for (let i = 0; i < message.barcode.length; i++) {
        buffer.writeUInt8(message.barcode[i], offset++)
    }
    for (let i = 0; i < message.productionDate.length; i++) {
        buffer.writeUInt8(message.productionDate[i], offset++)
    }
    for (let i = 0; i < message.releaseDate.length; i++) {
        buffer.writeUInt8(message.releaseDate[i], offset++)
    }
    for (let i = 0; i < message.updateDate.length; i++) {
        buffer.writeUInt8(message.updateDate[i], offset++)
    }
    return offset
}

//=============== realtimeInfo encoder
function realtimeInfoEncode(message, buffer) {
    let offset = 0
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }

    for (let i = 0; i < message.infos.length; i++) {
        buffer.writeUInt8(message.infos[i].tag, offset++)

        switch (message.infos[i].tag) {
            case 0x04://卫星定位系统数据
                offset += common_locationDataEncode(message.infos[i].value, buffer.slice(offset))
                break
            //case 0x05: complementInfoEncode,//补发信息上报
            case 0x80: //车辆状态信息
                offset += common_vehicleStatusEncode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x81: //仪表信息
                offset += common_dashboardInfoEncode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x82: //车辆故障信息
                offset += common_vehicleFailureEncode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x83: //车辆终端信息
                offset += common_terminalInfoEncode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x84: //车辆故障灯信息
                offset += common_failureLampEncode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x85: //车辆上报数据类型
                offset += common_vehicleReportTypeEncode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x86: //仪表信息 2
                offset += common_dashboardInfo2Encode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x87: //仪表信息 3
                offset += common_dashboardInfo3Encode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x88: //UBI 信息
                offset += common_UBIEncode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x89: //UBI 车辆状态
                offset += common_UBIVehicleEncode(message.infos[i].value, buffer.slice(offset))
                break
            case 0x8A: //受控车辆设置结果
                offset += common_configurationResultEncode(message.infos[i].value, buffer.slice(offset))
                break
            default:
                break
        }
    }
    return offset;
}

//=============== response message encoder    
function terminalControlResponseEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }
    buffer.writeUInt8(message.id, offset++)
    buffer.writeUInt8(message.command, offset++)

    if (message.id == 0x80) {
        switch (message.command) {
            case 0x01: //中控锁控制指令返回结果
            case 0x03: //空调控制指令返回结果
            case 0x04: //天窗控制指令返回结果
            case 0x05: //寻车控制指令返回结果
            case 0x08: //远程熄火返回结果
                buffer.writeUInt8(message.param[0], offset++)
                buffer.writeUInt16BE(message.result, offset)
                offset += 2
                break
            case 0x02: //车窗控制指令
            case 0x07: //远程启动返回结果
                buffer.writeUInt8(message.param[0], offset++)
                buffer.writeUInt8(message.param[1], offset++)
                buffer.writeUInt16BE(message.result, offset)
                offset += 2
                break

            case 0x06: //故障诊断控制指令返回结果
                buffer.writeUInt8(message.param[0], offset++)
                buffer.writeUInt16BE(message.length, offset)
                offset += 2
                for (let i = 0; i < message.result.length; i++) {
                    buffer.writeUInt8(message.result[i].type, offset++)
                    buffer.writeUInt16BE(message.result[i].count, offset)
                    offset += 2
                    for (let j = 0; j < message.result[i].codes.length; j++) {
                        for (let k = 0; k < message.result[i].codes[j].code.length; k++) {
                            buffer.writeUInt8(message.result[i].codes[j].code[k], offset++)
                        }
                    }
                }
                break

            case 0x09: // 查车返回结果
                offset += common_locationDataEncode(message.result, buffer.slice(offset));
                offset += common_vehicleStatusEncode(message.result, buffer.slice(offset));
                offset += common_dashboardInfo3Encode(message.result, buffer.slice(offset));
                break

            default:
                break
        }

    } else {
        // user define
    }
    return offset;
}

function linkConnectionResponseEncode(message, buffer) {
    let offset = 0;
    buffer.writeUInt8(message.result, offset++)
    return offset;
}

function infoBindResponseEncode(message, buffer) {
    let offset = 0;
    buffer.writeUInt16BE(message.result, offset)
    return offset;
}

function bigdataUploadEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }

    buffer.writeUInt8(message.type, offset++)
    buffer.writeUInt8(message.id, offset++)

    switch (message.id) {
        case 0x01:
            buffer.writeUInt32BE(message.totalLength, offset)
            offset += 2
            buffer.writeUInt16BE(message.segmentLength, offset)
            offset += 2
            break
        case 0x11:
            buffer.writeUInt16BE(message.result, offset)
            offset += 2
            break
        case 0x12:
            buffer.writeUInt16BE(message.serialNO, offset)
            offset += 2
            break
        case 0x13:
        case 0x03:
            buffer.writeUInt16BE(message.result, offset)
            offset += 2
            break
        case 0x02:
            buffer.writeUInt16BE(message.serialNO, offset)
            offset += 2
            for (let i = 0; i < message.data.length; i++) {
                buffer.writeUInt8(message.data[i], offset++)
            }
            break
    }
    return offset;
}

//============= command message encode

//车载终端控制命令 TSP->TBOX
function terminalControlEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }

    buffer.writeUInt8(message.id, offset++)

    switch (message.id) {
        case 0x80:
            buffer.writeUInt8(message.command, offset++)
            switch (message.command) {
                case 0x01: //中控锁控制指令 0:表示无动作 1:表示开锁 2:表示关锁
                case 0x03: //空调控制指令: 0:表示无动作 1:表示加热 2:表示制冷 3:表示关空调
                case 0x04: //天窗控制指令: 0:表示无动作 1:表示开天窗 2:表示关天窗
                case 0x05: //寻车控制指令 0:表示无动作 1:表示寻车
                case 0x06: //故障诊断控制指令 0:表示无动作 1:表示开始诊断
                case 0x08: //远程熄火 0-不动作;1-远程熄火
                case 0x09:  // 查车 0-不动作,1-查车
                    buffer.writeUInt8(message.param[0], offset++)
                    break
                case 0x02: //车窗控制指令,车窗控制参数数据格式和定义见表 38
                case 0x07: //远程启动 BYTE[0]: 0-不动作,1-启动 BYTE[1]:远程启动定时熄火时间,单位:分
                    buffer.writeUInt8(message.param[0], offset++)
                    buffer.writeUInt8(message.param[1], offset++)
                    break
                default:
                    break
            }
        default:
            break
    }
    return offset
}

//链路连接 TBOX->TSP
function linkConnectionEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }

    offset += common_locationDataEncode(message.locationData, buffer.slice(offset))

    for (let i = 0; i < message.tboxBarcode.length; i++) {
        buffer.writeUInt8(message.tboxBarcode[i], offset++)
    }
    return offset
}

//信息绑定 TBOX->TSP
function infoBindEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }

    offset += common_locationDataEncode(message.locationData, buffer.slice(offset))

    for (let i = 0; i < message.tboxBarcode.length; i++) {
        buffer.writeUInt8(message.tboxBarcode[i], offset++)
    }

    for (let i = 0; i < message.VIN.length; i++) {
        buffer.writeUInt8(message.VIN[i], offset++)
    }
    return offset
}

function parameterSetEncode(message, buffer) {
    return parameterGetResponseEncode(message, buffer)
}

function heartBeatEncode(message, buffer) {
    return 0
}

function loginEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.type.length; i++) {
        buffer.writeUInt8(message.type[i], offset++)
    }
    for (let i = 0; i < message.VIN.length; i++) {
        buffer.writeUInt8(message.VIN[i], offset++)
    }
    for (let i = 0; i < message.version.length; i++) {
        buffer.writeUInt8(message.version[i], offset++)
    }

    for (let i = 0; i < message.code.vendorCode.length; i++) {
        buffer.writeUInt8(message.code.vendorCode[i], offset++)
    }
    for (let i = 0; i < message.code.batchNO.length; i++) {
        buffer.writeUInt8(message.code.batchNO[i], offset++)
    }

    buffer.writeUInt16BE(message.code.serialNO, offset)
    offset += 2

    return offset
}

function logoutEncode(message, buffer) {
    return 0
}

//参数查询命令 下行 TSP->TBOX
function parameterGetEncode(message, buffer) {
    let offset = 0;
    for (let i = 0; i < message.timestamp.length; i++) {
        buffer.writeUInt8(message.timestamp[i], offset++)
    }
    buffer.writeUInt8(message.count, offset++);

    for (let i = 0; i < message.params.length; i++) {
        buffer.writeUInt8(message.params[i], offset++)
    }

    return offset;
}

function poiGetEncode(message, buffer) {
    return 0;
}

//0x01 成功 接收到的信息正确
function responseMessageEncode(message, buffer) {
    let offset = 0
    switch (message.command) {
        case 0x02://实时信息上报 上行 -- 无应答
        case 0x05: //补发信息上报 上行 = 实时信息上报 上行 -- 无应答
        case 0x04: //心跳 上行 -- 无应答
        case 0x07: //退录 上行 -- 无应答
            break;
        case 0x06: //登陆 上行
            offset += loginResponseEncode(message.data, buffer);
            break
        case 0x08: //远程升级 上行
            offset += remoteUpdateEncode(message.data, buffer);
            break
        case 0x80: //参数查询命令 下行
            offset += parameterGetResponseEncode(message.data, buffer);
            break
        case 0x81: //参数设置命令 下行
            offset += parameterSetResponseEncode(message.data, buffer);
            break
        case 0x82: //车载终端控制命令 下行
            offset += terminalControlResponseEncode(message.data, buffer);
            break
        case 0x83: //链路连接 上行
            offset += linkConnectionResponseEncode(message.data, buffer);
            break
        case 0x84: //信息绑定 上行
            offset += infoBindResponseEncode(message.data, buffer);
            break
        case 0x85: //大数据上传 上行
            offset += bigdataUploadEncode(message.data, buffer);
            break
        case 0x86: //POI 数据查询 上行
            offset += poiGetEncode(message.data, buffer);
            break
        default:
            break
    }
    return offset
}

//0xFE 命令 表示数据包为命令包;而非应答包
function commandMessageEncode(message, buffer) {
    let offset = 0
    switch (message.command) {
        // 当数据通信链路异常时, 车载终端应将实时上报数据进行本地存储。在数据通信链路恢复
        // 正常后, 在发送实时上报数据的同时补发存储的上报数据。补发的上报数据应为当日通信
        // 链路异常期间存储的数据, 数据格式与实时上报数据 相同, 并标识为补发信息上报(0x05)
        case 0x02: // 上行
        case 0x05: //补发信息上报 == 实时信息上报
            offset += realtimeInfoEncode(message.data, buffer);
            break
        case 0x04: //心跳 上行
            offset += heartBeatEncode(message.data, buffer);
            break
        case 0x06: //登陆 上行
            offset += loginEncode(message.data, buffer);
            break
        case 0x07: //退录 上行
            offset += logoutEncode(message.data, buffer);
            break
        case 0x08: //远程升级 上行
            offset += remoteUpdateEncode(message.data, buffer);
            break
        case 0x80: //参数查询命令 下行
            offset += parameterGetEncode(message.data, buffer);
            break
        case 0x81: //参数设置命令 下行
            offset += parameterSetEncode(message.data, buffer);
            break
        case 0x82: //车载终端控制命令 下行
            offset += terminalControlEncode(message.data, buffer);
            break
        case 0x83: //链路连接 上行
            offset += linkConnectionEncode(message.data, buffer);
            break
        case 0x84: //信息绑定 上行
            offset += infoBindEncode(message.data, buffer);
            break
        case 0x85: //大数据上传 上行
            offset += bigdataUploadEncode(message.data, buffer);
            break
        case 0x86: //POI 数据查询 上行
            offset += poiGetEncode(message.data, buffer);
        default:
            break;
    }
    return offset
}