const DELIMITER = 0x2323;
const HEADER_LENGTH_WITH_CRC = 25;

//============================Encode Entry========================================
module.exports.encode = function (message) {
  let offset = 0;
  let buffer = Buffer.alloc(HEADER_LENGTH_WITH_CRC + message.dataLength);

  buffer.writeUInt16BE(message.startDelimiter, offset)
  offset += 2;

  buffer.writeUInt8(message.command, offset++);
  buffer.writeUInt8(message.response, offset++);

  for (let i = 0; i < message.VIN.length; i++) {
    buffer.writeUInt8(message.VIN[i], offset++);
  }

  buffer.writeUInt8(message.encryptionMethod, offset++)
  buffer.writeUInt16BE(message.dataLength, offset);
  offset += 2;

  if (message.dataLength > 0) {
    switch (message.response) {
      case 0x00:
      case 0x01:
      case 0x02:
      case 0x03:
        offset += responseMessageEncode(message, buffer.slice(offset));
        break
      case 0xFE:
        offset += commandMessageEncode(message, buffer.slice(offset))
        break
      default:
        break
    }
  }

  buffer[buffer.length - 1] = calculateCRC(buffer);
  offset++

  //console.log(offset, 'byte(s) written')
  return buffer;
}

function calculateCRC(buffer) {
  let crc = buffer[0] ^ buffer[1];
  for (let i = 2; i < buffer.length - 1; i++) {
    crc ^= buffer[i];
  }
  return crc;
}

function common_vehicleDataEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.vehicleStatus, offset++)
  buffer.writeUInt8(message.chargingStatus, offset++)
  buffer.writeUInt8(message.runningMode, offset++)

  buffer.writeUInt16BE(message.velocity, offset);
  offset += 2;
  buffer.writeUInt32BE(message.milage, offset);
  offset += 4;
  buffer.writeUInt16BE(message.voltage, offset);
  offset += 2;
  buffer.writeUInt16BE(message.current, offset);
  offset += 2;

  buffer.writeUInt8(message.SOC, offset++)
  buffer.writeUInt8(message.DC2DC, offset++)
  buffer.writeUInt8(message.gear, offset++)

  buffer.writeUInt16BE(message.resistance, offset);
  offset += 2;
  buffer.writeUInt16BE(message.reserved, offset);
  offset += 2;

  return offset;
}

function common_electronicEngineDataEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.count, offset++)

  for (let i = 0; i < message.values.length; i++) {
    buffer.writeUInt8(message.values[i].sequence, offset++)
    buffer.writeUInt8(message.values[i].status, offset++)
    buffer.writeUInt8(message.values[i].controllerTemperature, offset++)

    buffer.writeUInt16BE(message.values[i].rotationSpeed, offset);
    offset += 2;
    buffer.writeUInt16BE(message.values[i].torque, offset);
    offset += 2;

    buffer.writeUInt8(message.values[i].motorTemperature, offset++)

    buffer.writeUInt16BE(message.values[i].voltage, offset);
    offset += 2;
    buffer.writeUInt16BE(message.values[i].current, offset);
    offset += 2;
  }

  return offset;
}

function common_fuelcellDataEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt16BE(message.voltage, offset);
  offset += 2;
  buffer.writeUInt16BE(message.current, offset);
  offset += 2;
  buffer.writeUInt16BE(message.consumptionRate, offset);
  offset += 2;
  buffer.writeUInt16BE(message.proberCount, offset);
  offset += 2;

  for (let i = 0; i < message.probers.length; i++) {
    buffer.writeUInt8(message.probers[i], offset++)
  }
  buffer.writeUInt16BE(message.highestTemperature, offset);
  offset += 2;
  buffer.writeUInt8(message.proberWithHighestTemperature, offset++)

  buffer.writeUInt16BE(message.highestDensity, offset);
  offset += 2;
  buffer.writeUInt8(message.sensorWithHighestDensity, offset++)

  buffer.writeUInt16BE(message.highestPressure, offset);
  offset += 2;
  buffer.writeUInt8(message.sensorWithHighestPressure, offset++)

  buffer.writeUInt8(message.D2DStatus, offset++)

  return offset;
}

function common_engineDataEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.engineStatus, offset++)
  buffer.writeUInt16BE(message.rotationSpeed, offset)
  offset += 2
  buffer.writeUInt16BE(message.consumptionRate, offset)
  offset += 2

  return offset;
}

function common_locationEncode(message, buffer) {
  let offset = 0;
  let status = 0;
  status |= message.status.validity
  status |= message.status.latitude << 1
  status |= message.status.longitude << 2
  status |= message.status.reserved << 3
  buffer.writeUInt8(status, offset++)

  buffer.writeUInt32BE(message.longitudeValue, offset);
  offset += 4;
  buffer.writeUInt32BE(message.latitudeValue, offset);
  offset += 4;

  return offset;
}

function common_alarmEncode(message, buffer) {
  let offset = 0;

  buffer.writeUInt8(message.highestAlarmLevel, offset++)
  buffer.writeUInt32BE(message.genericAlarmFlag, offset)
  offset += 4

  buffer.writeUInt8(message.countEngeryStorageAlarm, offset++)
  for (let i = 0; i < message.energyStorageAlarms.length; i++) {
    buffer.writeUInt32BE(message.energyStorageAlarms[i], offset)
    offset += 4
  }

  buffer.writeUInt8(message.countElectronicMotorAlarm, offset++)
  for (let i = 0; i < message.electroinicMotorAlarms.length; i++) {
    buffer.writeUInt32BE(message.electroinicMotorAlarms[i], offset)
    offset += 4
  }

  buffer.writeUInt8(message.countEngineAlarm, offset++)
  for (let i = 0; i < message.engineAlarms.length; i++) {
    buffer.writeUInt32BE(message.engineAlarms[i], offset)
    offset += 4
  }

  buffer.writeUInt8(message.countOtherAlarm, offset++)
  for (let i = 0; i < message.otherAlarms.length; i++) {
    buffer.writeUInt32BE(message.otherAlarms[i], offset)
    offset += 4
  }

  return offset;
}

function common_voltageDataEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.count, offset++)
  for (let i = 0; i < message.values.length; i++) {
    buffer.writeUInt8(message.values[i].subsystemNO, offset++)
    buffer.writeUInt16BE(message.values[i].subsystemVoltage, offset);
    offset += 2;
    buffer.writeUInt16BE(message.values[i].subsystemCurrent, offset);
    offset += 2;
    buffer.writeUInt16BE(message.values[i].batteryCount, offset);
    offset += 2;
    buffer.writeUInt16BE(message.values[i].batterySerialInFrame, offset);
    offset += 2;

    buffer.writeUInt8(message.values[i].batteryCountInFrame, offset++)
    for (let j = 0; j < message.values[i].batteryVoltages.length; j++) {
      buffer.writeUInt16BE(message.values[i].batteryVoltages[j], offset);
      offset += 2;
    }
  }

  return offset;
}

function common_temperatureDataEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.count, offset++)
  for (let i = 0; i < message.values.length; i++) {
    buffer.writeUInt8(message.values[i].subsystemNO, offset++)
    buffer.writeUInt16BE(message.values[i].countProber, offset);
    offset += 2;
    for (let j = 0; j < message.values[i].temperatures.length; j++) {
      buffer.writeUInt8(message.values[i].temperatures[j], offset++);
    }
  }

  return offset;
}

function common_maximalDataEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.batterySubsystemNO, offset++)
  buffer.writeUInt8(message.batteryWithHighestVoltage, offset++)
  buffer.writeUInt16BE(message.highestVoltage, offset);
  offset += 2;
  buffer.writeUInt8(message.batterySubsystemWithLowestVoltage, offset++)
  buffer.writeUInt8(message.batteryWithLowestVoltage, offset++)
  buffer.writeUInt16BE(message.lowestVoltage, offset);
  offset += 2;

  buffer.writeUInt8(message.subsystemWithHighestTemperature, offset++)
  buffer.writeUInt8(message.proberWithHighestTemperature, offset++)
  buffer.writeUInt8(message.highestTemperature, offset++)
  buffer.writeUInt8(message.subsystemWithLowestTemperature, offset++)
  buffer.writeUInt8(message.proberWithLowestTemperature, offset++)
  buffer.writeUInt8(message.lowestTemperature, offset++)

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

  let lock = 0;
  lock |= message.lock.bit0
  lock |= message.lock.bit1 << 1
  lock |= message.lock.bit2 << 2
  lock |= message.lock.bit3 << 3
  lock |= message.lock.bit4 << 4
  lock |= message.lock.bit5 << 5
  lock |= message.lock.bit6 << 6
  lock |= message.lock.bit7 << 7
  buffer.writeUInt8(lock, offset++)

  let window = 0;
  window |= message.window.bit0
  window |= message.window.bit1 << 1
  window |= message.window.bit2 << 2
  window |= message.window.bit3 << 3
  window |= message.window.bit4 << 4
  window |= message.window.bit5 << 5
  window |= message.window.bit6 << 6
  window |= message.window.bit7 << 7
  buffer.writeUInt8(window, offset++)

  let other = 0;
  other |= message.other.voltage
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
  buffer.writeUInt8(message.instantFuelConsumption, offset++)
  buffer.writeUInt16BE(message.tripAAverageFuelConsumption, offset);
  offset += 2;
  buffer.writeUInt16BE(message.tripBAverageFuelConsumption, offset);
  offset += 2;
  buffer.writeUInt16BE(message.remainedFuel, offset);
  offset += 2;

  buffer.writeUInt8(message.waterTemperature, offset++)
  buffer.writeUInt16BE(message.tripAFuelMilage, offset);
  offset += 2;
  buffer.writeUInt16BE(message.tripBFuelMilage, offset);
  offset += 2;
  buffer.writeUInt8(message.dashboardMode, offset++)
  buffer.writeUInt8(message.communicationSignal, offset++)

  buffer.writeUInt8(message.frontleft_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.frontleft_tyrepressure_status, offset++)
  buffer.writeUInt8(message.frontright_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.frontright_tyrestatus_status, offset++)
  buffer.writeUInt8(message.dashboarrearleft_tyrepressure_validdMode, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure_status, offset++)
  buffer.writeUInt8(message.rearright_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.rearright_tyrestatus_status, offset++)

  buffer.writeUInt8(message.frontleft_tyrepressure, offset++)
  buffer.writeUInt8(message.frontright_tyrepressure, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure, offset++)
  buffer.writeUInt8(message.rearright_tyrepressure, offset++)

  return offset;
}

function common_vehicleFailureEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt16BE(message.length, offset);
  offset += 2;
  for (let i = 0; i < message.failures.length; i++) {
    buffer.writeUInt8(message.failures[i].type, offset++)
    buffer.writeUInt16BE(message.failures[i].count, offset);
    offset += 2;
    for (let j = 0; j < message.failures[i].codes.length; j++) {
      buffer.writeUInt8(message.failures[i].codes[j].code[0], offset++);
      buffer.writeUInt8(message.failures[i].codes[j].code[1], offset++);
      buffer.writeUInt8(message.failures[i].codes[j].code[2], offset++);
    }
  }
  return offset;
}

function common_terminalInfoEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.softwareVersion.length; i++) {
    buffer.writeUInt8(message.softwareVersion[i], offset++)
  }
  for (let i = 0; i < message.hardwareVersion.length; i++) {
    buffer.writeUInt8(message.hardwareVersion[i], offset++)
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

  return offset;
}

function common_failureLampEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.length, offset++)
  for (let i = 0; i < message.lamps.length; i++) {
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

  return offset;
}

function common_vehicleReportTypeEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.type, offset++)
  return offset;
}

function common_UBIEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt8(message.instantFuelConsumption, offset++)
  buffer.writeUInt16BE(message.tripAAverageFuelConsumption, offset);
  offset += 2;
  buffer.writeUInt16BE(message.tripBAverageFuelConsumption, offset);
  offset += 2;

  buffer.writeUInt8(message.dashboardMode, offset++)
  buffer.writeUInt16BE(message.remainedFuel, offset);
  offset += 2;
  buffer.writeUInt16BE(message.wheelPosition, offset);
  offset += 2;
  buffer.writeUInt16BE(message.wheelRotationSpeed, offset);
  offset += 2;
  buffer.writeUInt16BE(message.accleration, offset);
  offset += 2;

  buffer.writeUInt8(message.frontleft_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.frontleft_tyrepressure_status, offset++)
  buffer.writeUInt8(message.frontright_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.frontright_tyrestatus_status, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure_status, offset++)
  buffer.writeUInt8(message.rearright_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.rearright_tyrestatus_status, offset++)

  buffer.writeUInt8(message.frontleft_tyrepressure, offset++)
  buffer.writeUInt8(message.frontright_tyrepressure, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure, offset++)
  buffer.writeUInt8(message.rearright_tyrepressure, offset++)

  return offset;
}

function common_evUBIEncode(message, buffer) {
  let offset = 0

  buffer.writeUInt8(message.instantEfficiency, offset++)
  buffer.writeUInt16BE(message.averageEfficiency, offset)
  offset += 2
  buffer.writeUInt16BE(message.wheelPosition, offset)
  offset += 2
  buffer.writeUInt16BE(message.wheelRotationSpeed, offset)
  offset += 2
  buffer.writeUInt16BE(message.accleration, offset)
  offset += 2

  buffer.writeUInt8(message.frontleft_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.frontleft_tyrepressure_status, offset++)
  buffer.writeUInt8(message.frontright_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.frontright_tyrestatus_status, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure_status, offset++)
  buffer.writeUInt8(message.rearright_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.rearright_tyrestatus_status, offset++)

  buffer.writeUInt8(message.frontleft_tyrepressure, offset++)
  buffer.writeUInt8(message.frontright_tyrepressure, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure, offset++)
  buffer.writeUInt8(message.rearright_tyrepressure, offset++)

  return offset
}

function common_evDashboardInfoEncode(message, buffer) {
  let offset = 0

  buffer.writeUInt8(message.instantEfficiency, offset++)
  buffer.writeUInt16BE(message.averageEfficiency, offset)
  offset += 2
  buffer.writeUInt8(message.waterTemperature, offset++)
  buffer.writeUInt16BE(message.rechargeMilage, offset)
  offset += 2
  buffer.writeUInt8(message.communicationSignal, offset++)

  buffer.writeUInt8(message.frontleft_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.frontleft_tyrepressure_status, offset++)
  buffer.writeUInt8(message.frontright_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.frontright_tyrestatus_status, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure_status, offset++)
  buffer.writeUInt8(message.rearright_tyrepressure_valid, offset++)
  buffer.writeUInt8(message.rearright_tyrestatus_status, offset++)

  buffer.writeUInt8(message.frontleft_tyrepressure, offset++)
  buffer.writeUInt8(message.frontright_tyrepressure, offset++)
  buffer.writeUInt8(message.rearleft_tyrepressure, offset++)
  buffer.writeUInt8(message.rearright_tyrepressure, offset++)

  return offset
}

function common_complementInfoEncode(message, buffer) {
  let offset = 0;

  for (let i = 0; i < message.currentMilage.length; i++) {
    buffer.writeUInt8(message.currentMilage[i], offset++)
  }

  buffer.writeUInt8(message.storageBatteryVoltage, offset++)
  buffer.writeUInt8(message.brakeFluid, offset++)
  buffer.writeUInt8(message.batteryActivation, offset++)

  buffer.writeUInt32BE(message.energyRecovery, offset);
  offset += 4;
  buffer.writeUInt32BE(message.accelerationCount, offset);
  offset += 4;
  buffer.writeUInt32BE(message.brakeCount, offset);
  offset += 4;

  buffer.writeUInt8(message.averageSOC, offset++)
  buffer.writeUInt8(message.lowestSOC, offset++)

  buffer.writeUInt32BE(message.deviationAlarmCount, offset);
  offset += 4;
  buffer.writeUInt32BE(message.frontwardCollisionAlarmCount, offset);
  offset += 4;
  buffer.writeUInt32BE(message.backwardCollisionAlarmCount, offset);
  offset += 4;
  buffer.writeUInt32BE(message.lateralCollisonAlarmCount, offset);
  offset += 4;
  return offset;
}

//===========================Message Parser=========================================
//登陆 TBOX->TSP
function loginEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }

  buffer.writeUInt16BE(message.sequence, offset);
  offset += 2;
  for (let i = 0; i < message.ICCID.length; i++) {
    buffer.writeUInt8(message.ICCID[i], offset++)
  }

  buffer.writeUInt8(message.subsystem, offset++)
  buffer.writeUInt8(message.codeLength, offset++)
  for (let i = 0; i < message.codes.length; i++) {
    buffer.writeUInt8(message.codes[i], offset++)
  }

  return offset;
}

//登陆响应 TSP->TBOX
function loginResponseEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }
  //buffer.writeUInt16BE(message.result, offset);

  return offset;
}

//实时信息上报 上行
function realtimeInfoEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }

  for (let i = 0; i < message.infos.length; i++) {
    buffer.writeUInt8(message.infos[i].tag, offset++)
    switch (message.infos[i].tag) {
      case 0x01: //整车数据
        offset += common_vehicleDataEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x02: //驱动电机数据
        offset += common_electronicEngineDataEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x03: //燃料电池数据
        offset += common_fuelcellDataEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x04: //发动机数据
        offset += common_engineDataEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x05: //车辆位置
        offset += common_locationEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x06: //极值数据
        offset += common_maximalDataEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x07: //报警数据
        offset += common_alarmEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x08: //可充电储能装置电压数据
        offset += common_voltageDataEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x09: //可充电储能装置温度数据
        offset += common_temperatureDataEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x80: //车辆状态信息
        offset += common_vehicleStatusEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x81: //传统车仪表信息
        offset += common_dashboardInfoEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x82: //车辆故障信息
        offset += common_vehicleFailureEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x83: //车辆故障灯信息
        offset += common_failureLampEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x84: //车辆上报数据类型
        offset += common_vehicleReportTypeEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x85: //传统车 UBI 信息
        offset += common_UBIEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x86: //新能源车 UBI 信息
        offset += common_evUBIEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x87: //新能源车仪表信息
        offset += common_evDashboardInfoEncode(message.infos[i].value, buffer.slice(offset))
        break
      case 0x88: //附加信息
        offset += common_complementInfoEncode(message.infos[i].value, buffer.slice(offset))
        break
      default:
        break
    }
  }

  return offset;
}

function logoutEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }
  buffer.writeUInt16BE(message.sequence, offset);
  offset += 2;

  return offset;
}

function parameterGetEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }
  buffer.writeUInt8(message.count, offset++)
  for (let i = 0; i < message.params.length; i++) {
    buffer.writeUInt8(message.params[i], offset++)
  }

  return offset;
}

function parameterGetResponseEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }

  buffer.writeUInt8(message.count, offset++)
  for (let i = 0; i < message.params.length; i++) {

    buffer.writeUInt8(message.params[i].id, offset++)
    switch (message.params[i].id) {
      case 0x01: //车载终端本地存储时间周期
      case 0x02: //正常时,信息上报时间周期
      case 0x03: //出现报警时,信息上报时间周期
      case 0x09: //车载终端心跳发送周期
      case 0x0c: //连续三次登入失败后,到下一次登入的间隔时间
      case 0x10: //是否处于抽样监测中
      case 0x16: //ACC 是否上报
      case 0x17: //休眠是否上报
      case 0x18: //关机是否上报
      case 0x19: //车身变化是否上报
      case 0x1A: //故障是否上报
      case 0x1C: //音响主机连接状态
      case 0x26: //PEPS 使能标志位
      case 0x27: //T-BOX 与 PEPS 本地认证使能标志位
      case 0x28: //T-BOX 复位 3G 模块
      case 0x2A: //T-BOX 自动绑定功能
      case 0x2B: //国标/企标上报使能
        buffer.writeUInt8(message.params[i].data, offset++)
        break

      case 0x04: //远程服务与管理平台域名长度 m
      case 0x0d: //公共平台域名
        buffer.writeUInt8(message.params[i].length, offset++)
        buffer.writeUInt8(message.params[i].id2, offset++)
        for (let j = 0; j < message.params[i].data.length; j++) {
          buffer.writeUInt8(message.params[i].data[j], offset++)
        }
        break

      case 0x06: //远程服务与管理平台端口
      case 0x0a: //终端应答超时时间
      case 0x0b: //平台应答超时时间
      case 0x0F: //公共平台端口
        buffer.writeUInt16BE(message.params[i].data, offset)
        offset += 2
        break

      case 0x07: //硬件版本
      case 0x08: //固件版本
      case 0x11: //服务中心号码
      case 0x12: //短信业务中心号码,上行号码
      case 0x13: //短信业务中心号码,上行号码
      case 0x14: //E-CALL 服务电话
      case 0x15: //E-CALL 服务电话
      case 0x24: //T-BOX 的 APN 参数信息
      case 0x25: //HU 的 APN 参数信息
        for (let j = 0; j < message.params[i].data.length; j++) {
          buffer.writeUInt8(message.params[i].data[j], offset++)
        }
        break

      case 0x1B: //数据采集信息
        buffer.writeUInt8(message.params[i].count, offset++)
        buffer.writeUInt16BE(message.params[i].duration, offset)
        offset += 2
        for (let j = 0; j < message.params[i].data.length; j++) {
          buffer.writeUInt16BE(message.params[i].data[j], offset)
          offset += 2
        }
        break

      case 0x1E: //车辆终端信息
        offset += common_terminalInfoEncode(message.params[i], buffer.slice(offset))
        break

      case 0x21: //一键导航目的地下发参数
        buffer.writeUInt16BE(message.params[i].data.seqence, offset)
        offset += 2
        buffer.writeUInt8(message.params[i].data.mothed, offset++)

        if (message.params[i].data.hasOwnProperty('dstPOI')) {
          for (let j = 0; j < message.params[i].data.dstPOI.length; j++) {
            buffer.writeUInt8(message.params[i].data.dstPOI[j], offset++)
          }
          buffer.writeUInt32BE(message.params[i].data.dstLatitude, offset);
          offset += 4;
          buffer.writeUInt32BE(message.params[i].data.dstLongitude, offset);
          offset += 4;
        }
        if (message.params[i].data.hasOwnProperty('viaPOI1')) {
          for (let j = 0; j < message.params[i].data.viaPOI1.length; j++) {
            buffer.writeUInt8(message.params[i].data.viaPOI1[j], offset++)
          }
          buffer.writeUInt32BE(message.params[i].data.viaPOI1Latitude, offset);
          offset += 4;
          buffer.writeUInt32BE(message.params[i].data.viaPOI1Longitude, offset);
          offset += 4;
        }
        if (message.params[i].data.hasOwnProperty('viaPOI2')) {
          for (let j = 0; j < message.params[i].data.viaPOI2.length; j++) {
            buffer.writeUInt8(message.params[i].data.viaPOI2[j], offset++)
          }
          buffer.writeUInt32BE(message.params[i].data.viaPOI2Latitude, offset);
          offset += 4;
          buffer.writeUInt32BE(message.params[i].data.viaPOI2Longitude, offset);
          offset += 4;
        }
        if (message.params[i].data.hasOwnProperty('viaPOI3')) {
          for (let j = 0; j < message.params[i].data.viaPOI3.length; j++) {
            buffer.writeUInt8(message.params[i].data.viaPOI3[j], offset++)
          }
          buffer.writeUInt32BE(message.params[i].data.viaPOI3Latitude, offset);
          offset += 4;
          buffer.writeUInt32BE(message.params[i].data.viaPOI3Longitude, offset);
          offset += 4;
        }
        break

      case 0x22: //URL 数据信息,数据格式见表 26
        buffer.writeUInt16BE(message.params[i].seqence, offset)
        offset += 2
        buffer.writeUInt8(message.params[i].textOrPicture, offset++)
        buffer.writeUInt8(message.params[i].allowPopup, offset++)
        for (let i = 0; i < message.params[i].data.length; i++) {
          buffer.writeUInt8(message.params[i].data[i], offset++)
        }

      default:
        break
    }
  }

  return offset;
}

var parameterSetEncode = parameterGetResponseEncode;

//车载终端控制命令 TSP-> TBOX
function terminalControlEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }

  buffer.writeUInt8(message.id, offset++)
  switch (message.id) {

    case 0x01: //中控锁控制指令 0:表示无动作 1:表示开锁 2:表示关锁
      for (let i = 0; i < message.url.length; i++) {
        buffer.writeUInt8(message.url[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.url.length; i++) {
        buffer.writeUInt8(message.url[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.APN.length; i++) {
        buffer.writeUInt8(message.APN[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.account.length; i++) {
        buffer.writeUInt8(message.account[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.password.length; i++) {
        buffer.writeUInt8(message.password[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.address.length; i++) {
        buffer.writeUInt8(message.address[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.port.length; i++) {
        buffer.writeUInt8(message.port[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.vendorID.length; i++) {
        buffer.writeUInt8(message.vendorID[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.hardwareVersion.length; i++) {
        buffer.writeUInt8(message.hardwareVersion[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      for (let i = 0; i < message.firmwareVersion.length; i++) {
        buffer.writeUInt8(message.firmwareVersion[i], offset++)
      }
      buffer.writeUInt8(';', offset++)

      buffer.writeUInt16BE(message.timeout, offset)
      offset += 2
      break

    case 0x02: //车载终端关机
    case 0x03: //车载终端复位
    case 0x04: //车载终端恢复出厂设置
    case 0x05: //断开数据通信链路
    case 0x07: //开启抽样监测链路
      break

    //车载终端报警/预警
    case 0x06:
      buffer.writeUInt8(message.alarmLevel, offset++)
      break

    case 0x80://车辆控制
      buffer.writeUInt8(message.sequence, offset++)
      buffer.writeUInt8(message.command, offset++)
      switch (message.command) {
        case 0x01: //中控锁控制指令 0:表示无动作 1:表示开锁 2:表示关锁
        case 0x03: //空调控制指令 0:表示无动作 1:表示加热 2:表示制冷 3:表示关空调
        case 0x04: //天窗控制指令 0:表示无动作 1:表示开天窗 2:表示关天窗
        case 0x05: //寻车控制指令 0:表示无动作 1:表示寻车
        case 0x06: //故障诊断控制指令 0:表示无动作 1:表示开始诊断
        case 0x07: //远程启动 BYTE[0]: 0-不动作,1-启动, BYTE[1]:远程启动定时熄火时间,单位:分
        case 0x08: //远程熄火 0-不动作;1-远程熄火
        case 0x09: //查车 0-不动作,1-查车
        case 0x0A: //后备箱(预留) 0:表示无动作 1:表示开后备箱
        case 0x0B: //机舱盖(预留) 0:表示无动作 1:表示开机舱盖
        case 0x0C: //座椅通风(预留) 0:表示无动作 1:表示开启座椅通风 2:表示关闭座椅通风
          buffer.writeUInt8(message.command, offset++)
          break
        //车窗控制指令 [0]车窗位置 [1]车窗位置
        case 0x02:
          buffer.writeUInt8(message.data[0], offset++)
          buffer.writeUInt8(message.data[1], offset++)
          break
      }

  }

  return offset;
}

//链路连接 TBOX->TSP
function linkConnectionEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }

  offset += common_locationEncode(message.locationData, buffer.slice(offset))

  for (let i = 0; i < message.barcode.length; i++) {
    buffer.writeUInt8(message.barcode[i], offset++)
  }
  return offset;
}

//链路连接应答 TSP-> TBOX
// function linkConnectionResponseEncode(message, buffer) {
//   let offset = 0;
//   buffer.writeUInt8(message.result, offset++)
//   return offset;
// }
// CAUTION: reverse engineering from LOG
function linkConnectionResponseEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }
  return offset;
}

//信息绑定 TBOX->TSP
function infoBindEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }

  offset += common_locationEncode(message.locationData, buffer.slice(offset))

  for (let i = 0; i < message.barcode.length; i++) {
    buffer.writeUInt8(message.barcode[i], offset++)
  }
  for (let i = 0; i < message.ICCID.length; i++) {
    buffer.writeUInt8(message.ICCID[i], offset++)
  }

  return offset;
}

//信息绑定应答 TSP-> TBOX
//0X01 - 绑定成功 0X3A - TBOX 已经绑定,自动绑定失败 0X3E - T-BOX 信息缺失,自动绑定失败
function infoBindResponseEncode(message, buffer) {
  let offset = 0;
  buffer.writeUInt16BE(message.result, offset)
  offset += 2
  return offset;
}

//参数设置应答 TBOX->TSP
function parameterSetResponseEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }

  buffer.writeUInt8(message.count, offset++)
  for (let i = 0; i < message.params.length; i++) {
    buffer.writeUInt8(message.params[i].id, offset++)
    buffer.writeUInt16BE(message.params[i].result, offset);
    offset += 2
  }

  return offset;
}

//车载终端控制响应 TBOX->TSP
function terminalControlResponseEncode(message, buffer) {
  let offset = 0;
  for (let i = 0; i < message.timestamp.length; i++) {
    buffer.writeUInt8(message.timestamp[i], offset++)
  }

  buffer.writeUInt8(message.id, offset++)
  buffer.writeUInt8(message.command, offset++)
  buffer.writeUInt16BE(message.result, offset)
  offset += 2

  return offset;
}

//大数据上传 TSP<=>TBOX
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
      offset += 4
      buffer.writeUInt16BE(message.segmentLength, offset)
      offset += 2
      break

    case 0x12:
      buffer.writeUInt16BE(message.sequence, offset)
      offset += 2
      break

    case 0x02:
      buffer.writeUInt16BE(message.sequence, offset)
      offset += 2
      for (let i = 0; i < message.data.length; i++) {
        buffer.writeUInt8(message.data[i], offset++)
      }
      break

    case 0x11:
    case 0x13:
      buffer.writeUInt16BE(message.result, offset)
      offset += 2
      break

    case 0x03:
      buffer.writeUInt8(message.result, offset++)
      break

  }

  return offset;
}

//======================Body Parser Entry==================================

//0x01 成功 接收到的信息正确
function responseMessageEncode(message, buffer) {
  switch (message.command) {
    case 0x07://心跳 - 响应
    case 0x08://终端校时 - 响应
      return 0;

    case 0x01://车辆登入 - 响应
      return loginResponseEncode(message.data, buffer);
    case 0x02://实时信息上报 - 响应
    case 0x03://补发信息上报 - 响应
      return realtimeInfoResponseEncode(message.data, buffer);
    case 0x04://车辆登出 - 响应
      return logoutResponsetEncode(message.data, buffer);
    case 0x09://链路连接 上行
      return linkConnectionResponseEncode(message.data, buffer);
    case 0x0A://信息绑定 上行
      return infoBindResponseEncode(message.data, buffer);
    case 0x0B://大数据上传
      return bigdataUploadParser(message.data, buffer);

    case 0x80://参数查询命令 下行
      return parameterGetResponseEncode(message.data, buffer);
    case 0x81://参数设置命令 下行
      return parameterSetResponseEncode(message.data, buffer);
    case 0x82://车载终端控制命令 下行
      return terminalControlResponseEncode(message.data, buffer);

    default:// others
      console.log('unknown command', message.command)
      return null;
  }
}

//0xFE 命令 表示数据包为命令包;而非应答包
function commandMessageEncode(message, buffer) {
  switch (message.command) {
    case 0x07://心跳 上行
    case 0x08://终端校时 上行
      return 0;

    case 0x01://车辆登入 上行
      return loginEncode(message.data, buffer);
    case 0x02://实时信息上报 上行
    case 0x03://补发信息上报 上行
      return realtimeInfoEncode(message.data, buffer);
    case 0x04://车辆登出 上行
      return logoutEncode(message.data, buffer);
    case 0x09://链路连接 上行
      return linkConnectionEncode(message.data, buffer);
    case 0x0A://信息绑定 上行
      return infoBindEncode(message.data, buffer);
    case 0x0B://大数据上传 上行
      return bigdataUploadParser(message.data, buffer);

    case 0x80://参数查询命令 下行
      return parameterGetEncode(message.data, buffer);
    case 0x81://参数设置命令 下行
      return parameterSetEncode(message.data, buffer);
    case 0x82://车载终端控制命令 下行/上行
      return terminalControlEncode(message.data, buffer);

    default:// others
      console.log('unknown command', message.command)
      return null;
  }
}
