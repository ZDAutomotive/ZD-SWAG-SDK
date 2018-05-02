var Parser = require('binary-parser').Parser;

//============================Parser Entry========================================
module.exports.parse = function (buffer) {
  let headerParser = new Parser()
    .uint16('startDelimiter', { assert: 0x2323 })
    .uint8('command')
    .uint8('response')
    .array('VIN', { type: 'uint8', length: 17 })
    .uint8('encryptionMethod')
    .uint16('dataLength')
    .buffer('data', { length: 'dataLength' })
    .uint8('CRC');

  // try {
  let message = headerParser.parse(buffer);
  let messageBody = null;
  //console.log(message.data)

  if (message.dataLength > 0) {
    switch (message.response) {
      case 0x00: // for test purpose
      case 0x01: //成功
      case 0x02: //错误
      case 0x03: //VIN 重复
        messageBody = responseMessageParser(message);
        break;
      //未定义
      //case 0x04-0xFD
      case 0xfe: //命令
        messageBody = commandMessageParser(message);
        break;
      default:
        messageBody = null;
    }
    delete message.data;
  }

  message.data = messageBody;
  return message;

  // } catch (e) {
  //     console.log(e);
  //     return null;
  // }
};

//==========================common functions and parsers===============================
function dateFormatter(dateArray) {
  return {
    year: dateArray[0],
    month: dateArray[1],
    day: dateArray[2],
    hour: dateArray[3],
    minute: dateArray[4],
    second: dateArray[5]
  };
}

var common_vehicleDataParser = new Parser()
  .uint8('vehicleStatus')
  .uint8('chargingStatus')
  .uint8('runningMode')
  .uint16('velocity')
  .uint32('milage')
  .uint16('voltage')
  .uint16('current')
  .uint8('SOC')
  .uint8('DC2DC')
  .uint8('gear')
  .uint16('resistance')
  .uint16('reserved');

var common_electronicEngineDataParser = new Parser()
  .uint8('count')
  .array('values', {
    length: 'count',
    type: new Parser()
      .uint8('sequence')
      .uint8('status')
      .uint8('controllerTemperature')
      .uint16('rotationSpeed')
      .uint16('torque')
      .uint8('motorTemperature')
      .uint16('voltage')
      .uint16('current')
  });

var common_fuelcellDataParser = new Parser()
  .uint16('voltage')
  .uint16('current')
  .uint16('consumptionRate')
  .uint16('proberCount')
  .array('probers', { length: 'proberCount', type: 'uint8' })
  .uint16('highestTemperature')
  .uint8('proberWithHighestTemperature')
  .uint16('highestDensity')
  .uint8('sensorWithHighestDensity')
  .uint16('highestPressure')
  .uint8('sensorWithHighestPressure')
  .uint8('D2DStatus');

var common_engineDataParser = new Parser()
  .uint8('engineStatus')
  .uint16('rotationSpeed')
  .uint16('consumptionRate');

var common_locationDataParser = new Parser()
  .array('status', {
    lengthInBytes: 1,
    type: new Parser()
      .endianess('little')
      .bit1('validity')
      .bit1('latitude')
      .bit1('longitude')
      .bit5('reserved'),
    formatter: function (value) {
      return value[0];
    }
  })
  .uint32('longitudeValue')
  .uint32('latitudeValue');

var common_alarmParser = new Parser()
  .uint8('highestAlarmLevel')
  .uint32('genericAlarmFlag')
  .uint8('countEngeryStorageAlarm')
  .array('energyStorageAlarms', {
    type: 'uint32be',
    length: 'countEngeryStorageAlarm'
  })
  .uint8('countElectronicMotorAlarm')
  .array('electroinicMotorAlarms', {
    type: 'uint32be',
    length: 'electroinicMotorAlarms'
  })
  .uint8('countEngineAlarm')
  .array('engineAlarms', {
    type: 'uint32be',
    length: 'countEngineAlarm'
  })
  .uint8('countOtherAlarm')
  .array('otherAlarms', {
    type: 'uint32be',
    length: 'countOtherAlarm'
  })

var common_voltageDataParser = new Parser()
  .uint8('count')
  .array('values', {
    length: 'count',
    type: new Parser()
      .uint8('subsystemNO')
      .uint16('subsystemVoltage')
      .uint16('subsystemCurrent')
      .uint16('batteryCount')
      .uint16('batterySerialInFrame')
      .uint8('batteryCountInFrame')
      .array('batteryVoltages', { type: 'uint16be', length: 'batteryCountInFrame' })
  });

var common_temperatureDataParser = new Parser()
  .uint8('count')
  .array('values', {
    length: 'count',
    type: new Parser()
      .uint8('subsystemNO')
      .uint16('countProber')
      .array('temperatures', { type: 'uint8', length: 'countProber' })
  })

var common_maximalDataParser = new Parser()
  .uint8('batterySubsystemNO')
  .uint8('batteryWithHighestVoltage')
  .uint16('highestVoltage')
  .uint8('batterySubsystemWithLowestVoltage')
  .uint8('batteryWithLowestVoltage')
  .uint16('lowestVoltage')
  .uint8('subsystemWithHighestTemperature')
  .uint8('proberWithHighestTemperature')
  .uint8('highestTemperature')
  .uint8('subsystemWithLowestTemperature')
  .uint8('proberWithLowestTemperature')
  .uint8('lowestTemperature');

var common_vehicleStatusParser = new Parser()
  .array('alarm', {
    lengthInBytes: 1,
    type: new Parser()
      .endianess('little')
      .bit1('bit0') //BIT0=1: 未定义
      .bit1('bit1') //BIT1=1: 馈电报警
      .bit1('bit2') //BIT2=1: 欠压报警
      .bit1('bit3') //BIT3=1: 车辆胎压异常报警
      .bit1('bit4') //BIT4=1: 碰撞报警
      .bit1('bit5') //BIT5=1: 异动报警
      .bit1('bit6') //BIT6=1: 盗警
      .bit1('bit7'), //BIT7=1: 车载终端主电被切断
    formatter: function (value) {
      return value[0];
    }
  })
  .array('lamp', {
    lengthInBytes: 1,
    type: new Parser()
      .endianess('little')
      .bit1('bit0') //(0:关闭,1:右灯,2:左灯,3:危险灯)
      .bit2('bit1_2') //BIT2-BIT1: 转向灯(0:关闭,1:右灯,2:左灯,3:危险灯)
      .bit1('bit3') //BIT3=1: 前雾灯(0:关闭,1:打开)
      .bit1('bit4') //BIT4=1: 后雾灯(0:关闭,1:打开)
      .bit1('bit5') //BIT5=1: 位置灯(0:关闭,1:打开)
      .bit1('bit6') //BIT6=1: 近光灯(0:关闭,1:打开)
      .bit1('bit7'), //BIT7=1: 远光灯(0:关闭,1:打开)
    formatter: function (value) {
      return value[0];
    }
  })
  .array('door', {
    lengthInBytes: 1,
    type: new Parser()
      .endianess('little')
      .bit1('bit0') //BIT0=1: 未定义
      .bit1('bit1') //BIT1=1: 未定义
      .bit1('bit2') //BIT2=1: 发 动 机 舱 盖 ( 0 : 关闭, 1:打开)
      .bit1('bit3') //BIT3=1: 后备箱(0:关闭,1:打开)
      .bit1('bit4') //BIT4=1: 右后门(0:关闭,1:打开)
      .bit1('bit5') //BIT5=1: 左后门(0:关闭,1:打开)
      .bit1('bit6') //BIT6=1: 右前门(0:关闭,1:打开)
      .bit1('bit7'), //BIT7=1: 左前门(0:关闭,1:打开)
    formatter: function (value) {
      return value[0];
    }
  })
  .array('lock', {
    lengthInBytes: 1,
    type: new Parser()
      .endianess('little')
      .bit1('bit0') //BIT0=1: 驾驶员安全带状态(0:未绑,1:已绑)
      .bit1('bit1') //BIT1=1: 乘客安全带状态(0:未绑,1:已绑)
      .bit1('bit2') //BIT2=1: 手刹状态(0:开锁,1:闭锁)
      .bit1('bit3') //BIT3=1: 右后门锁(0:开锁,1:闭锁)
      .bit1('bit4') //BIT4=1: 左后门锁(0:开锁,1:闭锁)
      .bit1('bit5') //BIT5=1: 右前门锁(0:开锁,1:闭锁)
      .bit1('bit6') //BIT6=1: 左前门锁(0:开锁,1:闭锁)
      .bit1('bit7'), //BIT7=1: 中控锁(0:开锁,1:闭锁)
    formatter: function (value) {
      return value[0];
    }
  })
  .array('window', {
    lengthInBytes: 1,
    type: new Parser()
      .endianess('little')
      .bit1('bit0') //BIT0=1: 未定义
      .bit1('bit1') //BIT1=1: 未定义
      .bit1('bit2') //BIT2=1: 室内灯光(0:关闭,1:打开)
      .bit1('bit3') //BIT3=1: 天窗(0:关闭,1:打开)
      .bit1('bit4') //BIT4=1: 右后窗(0:关闭,1:打开)
      .bit1('bit5') //BIT5=1: 左后窗(0:关闭,1:打开)
      .bit1('bit6') //BIT6=1: 右前窗(0:关闭,1:打开)
      .bit1('bit7'), //BIT7=1: 左前窗(0:关闭,1:打开)
    formatter: function (value) {
      return value[0];
    }
  })
  .array('other', {
    lengthInBytes: 1,
    type: new Parser()
      .endianess('little')
      .bit1('voltage') //电瓶电压(单位:0.1V)
      .bit1('aircondition') //BIT1=1: 空调开关(0:关闭,1:打开)
      .bit1('PEPS') //BIT2=1: PEPS 状 态 ( 0 : 无PEPS,1:有 PEPS,默认为 1)
      .bit3('power') //BIT3-BIT5: 电源(0 : Off , 1 : Acc , 2 : On , 3 :Start)
      .bit1('bit6') //BIT6=1: 未定义
      .bit1('airbag'), //BIT7=1: 安全气囊状态(0:关闭;1 打开)
    formatter: function (value) {
      return value[0];
    }
  });

var common_dashboardInfoParser = new Parser()
  .uint8('instantFuelConsumption')
  .uint16('tripAAverageFuelConsumption')
  .uint16('tripBAverageFuelConsumption')
  .uint16('remainedFuel')
  .uint8('waterTemperature')
  .uint16('tripAFuelMilage')
  .uint16('tripBFuelMilage')
  .uint8('dashboardMode')
  .uint8('communicationSignal')

  .uint8('frontleft_tyrepressure_valid')
  .uint8('frontleft_tyrepressure_status')
  .uint8('frontright_tyrepressure_valid')
  .uint8('frontright_tyrestatus_status')
  .uint8('rearleft_tyrepressure_valid')
  .uint8('rearleft_tyrepressure_status')
  .uint8('rearright_tyrepressure_valid')
  .uint8('rearright_tyrestatus_status')

  .uint8('frontleft_tyrepressure')
  .uint8('frontright_tyrepressure')
  .uint8('rearleft_tyrepressure')
  .uint8('rearright_tyrepressure');

var common_vehicleFailureParser = new Parser()
  .uint16('length')
  .array('failures', {
    lengthInBytes: function () {
      return this.length - 2;
    },
    type: new Parser()
      .uint8('type')
      .uint16('count')
      .array('codes', {
        length: 'count',
        type: new Parser().array('code', { type: 'uint8', length: 3 })
      })
  });

var common_terminalInfoParser = new Parser()
  .array('softwareVersion', { type: 'uint8', length: 4 })
  .array('hardwareVersion', { type: 'uint8', length: 4 })
  .array('barcode', { type: 'uint8', length: 26 })
  .array('productionDate', { type: 'uint8', length: 6 })
  .array('releaseDate', { type: 'uint8', length: 6 })
  .array('updateDate', { type: 'uint8', length: 6 });

var common_failureLampParser = new Parser()
  .uint8('length')
  .array('lamps', {
    length: function () {
      return this.length - 1;
    },
    type: new Parser()
      .endianess('little')
      .bit1('bit0') //BIT0
      .bit1('bit1') //BIT1
      .bit1('bit2') //BIT2
      .bit1('bit3') //BIT3
      .bit1('bit4') //BIT4
      .bit1('bit5') //BIT5
      .bit1('bit6') //BIT6
      .bit1('bit7') //BIT7
  });

var common_vehicleReportTypeParser = new Parser().uint8('type');

var common_UBIParser = new Parser()
  .uint8('instantFuelConsumption')
  .uint16('tripAAverageFuelConsumption')
  .uint16('tripBAverageFuelConsumption')
  .uint8('dashboardMode')
  .uint16('remainedFuel')
  .uint16('wheelPosition')
  .uint16('wheelRotationSpeed')
  .uint16('accleration')

  .uint8('frontleft_tyrepressure_valid')
  .uint8('frontleft_tyrepressure_status')
  .uint8('frontright_tyrepressure_valid')
  .uint8('frontright_tyrestatus_status')
  .uint8('rearleft_tyrepressure_valid')
  .uint8('rearleft_tyrepressure_status')
  .uint8('rearright_tyrepressure_valid')
  .uint8('rearright_tyrestatus_status')

  .uint8('frontleft_tyrepressure')
  .uint8('frontright_tyrepressure')
  .uint8('rearleft_tyrepressure')
  .uint8('rearright_tyrepressure');

var common_evUBIParser = new Parser()
  .uint8('instantEfficiency')
  .uint16('averageEfficiency')
  .uint16('wheelPosition')
  .uint16('wheelRotationSpeed')
  .uint16('accleration')

  .uint8('frontleft_tyrepressure_valid')
  .uint8('frontleft_tyrepressure_status')
  .uint8('frontright_tyrepressure_valid')
  .uint8('frontright_tyrestatus_status')
  .uint8('rearleft_tyrepressure_valid')
  .uint8('rearleft_tyrepressure_status')
  .uint8('rearright_tyrepressure_valid')
  .uint8('rearright_tyrestatus_status')

  .uint8('frontleft_tyrepressure')
  .uint8('frontright_tyrepressure')
  .uint8('rearleft_tyrepressure')
  .uint8('rearright_tyrepressure');

var common_evDashboardInfoParser = new Parser()
  .uint8('instantEfficiency')
  .uint16('averageEfficiency')
  .uint8('waterTemperature')
  .uint16('rechargeMilage')
  .uint8('communicationSignal')

  .uint8('frontleft_tyrepressure_valid')
  .uint8('frontleft_tyrepressure_status')
  .uint8('frontright_tyrepressure_valid')
  .uint8('frontright_tyrestatus_status')
  .uint8('rearleft_tyrepressure_valid')
  .uint8('rearleft_tyrepressure_status')
  .uint8('rearright_tyrepressure_valid')
  .uint8('rearright_tyrestatus_status')

  .uint8('frontleft_tyrepressure')
  .uint8('frontright_tyrepressure')
  .uint8('rearleft_tyrepressure')
  .uint8('rearright_tyrepressure');

var common_complementInfoParser = new Parser()
  .array('currentMilage', { type: 'uint8', length: 3 })
  .uint8('storageBatteryVoltage')
  .uint8('brakeFluid')
  .uint8('batteryActivation')
  .uint32('energyRecovery')
  .uint32('accelerationCount')
  .uint32('brakeCount')
  .uint8('averageSOC')
  .uint8('lowestSOC')
  .uint32('deviationAlarmCount')
  .uint32('frontwardCollisionAlarmCount')
  .uint32('backwardCollisionAlarmCount')
  .uint32('lateralCollisonAlarmCount')

//===========================Message Parser=========================================
//登陆 TBOX->TSP
var loginParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
  .uint16('sequence')
  .array('ICCID', { type: 'uint8', length: 20 })
  .uint8('subsystem')
  .uint8('codeLength')
  .array('codes', {
    type: 'uint8',
    length: function () {
      return this.energySubSystem * this.systemCode;
    }
  });

//登陆响应 TSP->TBOX
var loginResponseParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
//.uint16('result');

//实时信息上报 上行
function realtimeInfoParser(message) {
  return new Parser()
    .array('timestamp', { type: 'uint8', lengthInBytes: 6 })
    .array('infos', {
      lengthInBytes: message.dataLength - 6,
      type: new Parser()
        .uint8('tag')
        .choice({
          tag: 'tag',
          defaultChoice: new Parser(),
          formatter: function (data) {
            let tag = data.tag;
            delete data.tag;
            return { tag, value: data };
          },
          choices: {
            //整车数据
            0x01: common_vehicleDataParser,
            //驱动电机数据
            0x02: common_electronicEngineDataParser,
            //燃料电池数据
            0x03: common_fuelcellDataParser,
            //发动机数据
            0x04: common_engineDataParser,
            //车辆位置
            0x05: common_locationDataParser,
            //极值数据
            0x06: common_maximalDataParser,
            //报警数据
            0x07: common_alarmParser,
            //可充电储能装置电压数据
            0x08: common_voltageDataParser,
            //可充电储能装置温度数据
            0x09: common_temperatureDataParser,

            //0x0A~0x2F 平台交换协议自定义数据
            //0x30~0x7F 预留

            //车辆状态信息
            0x80: common_vehicleStatusParser,
            //传统车仪表信息
            0x81: common_dashboardInfoParser,
            //车辆故障信息
            0x82: common_vehicleFailureParser,
            //车辆故障灯信息
            0x83: common_failureLampParser,
            //车辆上报数据类型
            0x84: common_vehicleReportTypeParser,
            //传统车 UBI 信息
            0x85: common_UBIParser,
            //新能源车 UBI 信息
            0x86: common_evUBIParser,
            //新能源车仪表信息
            0x87: common_evDashboardInfoParser,
            //附加信息
            0x88: common_complementInfoParser
            //0x80~0xFE 用户自定义
            // 0x89: common_UBIVehicleParser, //UBI 车辆状态
            // 0x8a: common_configurationResultParser //受控车辆设置结果
          }
        })
    })
    .parse(message.data);
}

var realtimeInfoResponseParser = new Parser();

var logoutParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
  .uint16('sequence')

var logoutResponsetParser = new Parser();

//参数查询命令 下行 TSP->TBOX
var parameterGetParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
  .uint8('count')
  .array('params', { type: 'uint8', length: 'count' });

//参数查询 响应命令 TBOX->TSP
var parameterGetResponseParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
  .uint8('count')
  .array('params', {
    length: 'count',
    type: new Parser()
      .uint8('id')
      .choice({
        tag: 'id',
        choices: {
          //车载终端本地存储时间周期
          0x01: new Parser().uint16('data'),
          //正常时,信息上报时间周期
          0x02: new Parser().uint16('data'),
          //出现报警时,信息上报时间周期
          0x03: new Parser().uint16('data'),
          //远程服务与管理平台域名长度 m
          0x04: new Parser()
            .uint8('length')
            .uint8('id2', { assert: 0x05 })
            .array('data', { type: 'uint8', length: 'length' }),
          //远程服务与管理平台端口
          0x06: new Parser().uint16('data'),
          //硬件版本
          0x07: new Parser().array('data', { type: 'uint8', length: 5 }),
          //固件版本
          0x08: new Parser().array('data', { type: 'uint8', length: 5 }),
          //车载终端心跳发送周期
          0x09: new Parser().uint8('data'),
          //终端应答超时时间
          0x0a: new Parser().uint16('data'),
          //平台应答超时时间
          0x0b: new Parser().uint16('data'),
          //连续三次登入失败后,到下一次登入的间隔时间
          0x0c: new Parser().uint8('data'),
          //公共平台域名
          0x0d: new Parser()
            .uint8('length')
            .uint8('id2', { assert: 0x0E })
            .array('data', { type: 'uint8', length: 'length' }),
          //公共平台端口
          0x0F: new Parser().uint16('data'),
          //是否处于抽样监测中
          0x10: new Parser().uint8('data'),
          //服务中心号码
          0x11: new Parser().array('data', { type: 'uint8', length: 16 }),
          //短信业务中心号码,上行号码
          0x12: new Parser().array('data', { type: 'uint8', length: 25 }),
          //短信业务中心号码,上行号码
          0x13: new Parser().array('data', { type: 'uint8', length: 25 }),
          //E-CALL 服务电话
          0x14: new Parser().array('data', { type: 'uint8', length: 16 }),
          //E-CALL 服务电话
          0x15: new Parser().array('data', { type: 'uint8', length: 16 }),
          //ACC 是否上报
          0x16: new Parser().uint8('data'),
          //休眠是否上报
          0x17: new Parser().uint8('data'),
          //关机是否上报
          0x18: new Parser().uint8('data'),
          //车身变化是否上报
          0x19: new Parser().uint8('data'),
          //故障是否上报
          0x1A: new Parser().uint8('data'),
          //数据采集信息
          0x1B: new Parser()
            .uint8('count')
            .uint16('duration')
            .array('data', { type: 'uint16be', length: 'count' }),
          //音响主机连接状态
          0x1C: new Parser().uint8('data'),
          //车辆终端信息
          0x1E: common_terminalInfoParser,
          //一键导航目的地下发参数
          0x21: new Parser()
            .array('data', {
              lengthInBytes: 83, 
              formatter: function (data) { return data[0] },
              type: new Parser()
                .uint16('seqence')
                .uint8('mothed') //0:系统推荐,1:高速优先,2:一般公路优先,3:最短时间,4:最短距离
                .array('dstPOI', { type: 'uint8', length: 32 }) //目的地 POI 名称
                .uint32('dstLatitude') //单位:千万分之一度,保留小数点后 7 位
                .uint32('dstLongitude') //单位:千万分之一度,保留小数点后 7 位
                .array('viaPOI1', { type: 'uint8', length: 32 })
                .uint32('viaPOI1Latitude') //单位:千万分之一度,保留小数点后 7 位
                .uint32('viaPOI1Longitude') //单位:千万分之一度,保留小数点后 7 位
                // .array('viaPOI2', { type: 'uint8', length: 32 })
                // .uint32('viaPOI2Latitude') //单位:千万分之一度,保留小数点后 7 位
                // .uint32('viaPOI2Longitude') //单位:千万分之一度,保留小数点后 7 位
                // .array('viaPOI3', { type: 'uint8', length: 32 })
                // .uint32('viaPOI3Latitude') //单位:千万分之一度,保留小数点后 7 位
                // .uint32('viaPOI3Longitude'), //单位:千万分之一度,保留小数点后 7 位
              }),              
              //URL 数据信息,数据格式见表 26
              0x22: new Parser()
                .uint16('seqence')
                .uint8('textOrPicture') //文本还是图片 0:文本,1:图片
                .uint8('allowPopup') //弹屏标志 0:不弹屏,1:弹屏
                .array('data', { type: 'uint8', length: '256' }),
              //T-BOX 的 APN 参数信息
              0x24: new Parser().array('data', { type: 'uint8', length: 32 }),
              //HU 的 APN 参数信息
              0x25: new Parser().array('data', { type: 'uint8', length: 32 }),
              //PEPS 使能标志位
              0x26: new Parser().uint8('data'),
              //T-BOX 与 PEPS 本地认证使能标志位
              0x27: new Parser().uint8('data'),
              //T-BOX 复位 3G 模块, 0:不复位;1:复位
              0x28: new Parser().uint8('data'),
              //T-BOX 自动绑定功能, 0:不动作;1:上报自动绑定报文
              0x2A: new Parser().uint8('data'),
              //国标/企标上报使能, 0:上报国标+企标内容 1:上报国标内容
              0x2B: new Parser().uint8('data'),
            }
      })
  });

var parameterSetParser = parameterGetResponseParser;

//车载终端控制命令 TSP-> TBOX
var terminalControlParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
  .uint8('id')
  .choice({
    tag: 'id',
    choices: {
      //远程升级:根据需要组合升级参数,参数之间用半角分号分隔。
      0x01: new Parser()
        .array('url', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .array('APN', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .array('account', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .array('password', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .array('address', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .array('port', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .array('vendorID', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .array('hardwareVersion', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .array('firmwareVersion', {
          type: 'uint8', readUntil: function (item, buffer) {
            return item === ';'
          }
        })
        .uint16('timeout'),
      //车载终端关机
      0x02: new Parser(),
      //车载终端复位
      0x03: new Parser(),
      //车载终端恢复出厂设置
      0x04: new Parser(),
      //断开数据通信链路
      0x05: new Parser(),
      //车载终端报警/预警
      0x06: new Parser().uint8('alarmLevel'),
      //开启抽样监测链路
      0x07: new Parser(),
      //车辆控制
      0x80: new Parser()
        .uint8('sequence')
        .uint8('command')
        .choice({
          tag: 'command',
          choices: {
            //中控锁控制指令 0:表示无动作 1:表示开锁 2:表示关锁
            0x01: new Parser().uint8('data'),
            //车窗控制指令 [0]车窗位置 [1]车窗位置
            0x02: new Parser().array('data', { type: 'uint8', length: 2 }),
            //空调控制指令 0:表示无动作 1:表示加热 2:表示制冷 3:表示关空调
            0x03: new Parser().uint8('data'),
            //天窗控制指令 0:表示无动作 1:表示开天窗 2:表示关天窗
            0x04: new Parser().uint8('data'),
            //寻车控制指令 0:表示无动作 1:表示寻车
            0x05: new Parser().uint8('data'),
            //故障诊断控制指令 0:表示无动作 1:表示开始诊断
            0x06: new Parser().uint8('data'),
            //远程启动 BYTE[0]: 0-不动作,1-启动, BYTE[1]:远程启动定时熄火时间,单位:分            
            0x07: new Parser().array('data',{type:'uint8',length:2}),
            //远程熄火 0-不动作;1-远程熄火
            0x08: new Parser().uint8('data'),
            //查车 0-不动作,1-查车
            0x09: new Parser().uint8('data'),
            //后备箱(预留) 0:表示无动作 1:表示开后备箱
            0x0A: new Parser().uint8('data'),
            //机舱盖(预留) 0:表示无动作 1:表示开机舱盖
            0x0B: new Parser().uint8('data'),
            //座椅通风(预留) 0:表示无动作 1:表示开启座椅通风 2:表示关闭座椅通风
            0x0C: new Parser().uint8('data'),
          }
        })
    }
  })

//心跳 (无内容)
var heartBeatParser = new Parser();

//终端校时 (无内容)
var timeCalibrationParser = new Parser();

//链路连接 TBOX->TSP
var linkConnectionParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
  .array('locationData', {
    lengthInBytes: 9,
    type: common_locationDataParser,
    formatter: function (data) {
      return data[0];
    }
  })
  .array('barcode', { type: 'uint8', length: 26 });

//链路连接应答 TSP-> TBOX
//var linkConnectionResponseParser = new Parser().uint8('result');
var linkConnectionResponseParser = new Parser().array('timestamp', { type: 'uint8', length: 6 })

//信息绑定 TBOX->TSP
var infoBindParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
  .array('locationData', {
    lengthInBytes: 23,
    type: common_locationDataParser,
    formatter: function (data) {
      return data[0];
    }
  })
  .array('barcode', { type: 'uint8', length: 26 })
  .array('ICCID', { type: 'uint8', length: 20 });

//信息绑定应答 TSP-> TBOX
//0X01 - 绑定成功 0X3A - TBOX 已经绑定,自动绑定失败 0X3E - T-BOX 信息缺失,自动绑定失败
var infoBindResponseParser = new Parser().uint16('result');



//退录 (无内容)
// //远程升级 上行
// var remoteUpdateParser = new Parser()
//   .array('timestamp', { type: 'uint8', length: 6 })
//   .uint8('command')
//   .choice({
//     tag: 'command',
//     choices: {
//       //网关下发升级请求 TSP->TBOX
//       0x01: new Parser()
//         .array('ftpServer', { type: 'uint8', length: 4 })
//         .uint16('port')
//         .array('account', { type: 'uint8', length: 32 })
//         .array('password', { type: 'uint8', length: 16 })
//         .array('fileName', { type: 'uint8', length: 20 })
//         .uint32('fileLength'),
//       //终端应答升级请求 TBOX->TSP
//       0x11: new Parser().uint16('result'),
//       //终端上报升级状态 TBOX->TSP
//       0x12: new Parser().uint16('result'),
//       //网关应答升级状态 TSP->TBOX
//       0x12: new Parser().uint16('result')
//     }
//   });


//参数设置应答 TBOX->TSP
var parameterSetResponseParser = new Parser()
  .array('timestamp', { type: 'uint8', length: 6 })
  .uint8('count')
  .array('params', {
    length: 'count',
    type: new Parser().uint8('id').uint16('result')
  });


//车载终端控制响应 TBOX->TSP
var terminalControlResponseParser = terminalControlParser
  .array('timestamp', { type: 'uint8', length: 6 })
  .uint8('id')
  .uint8('command')
  .uint16('result')

//大数据上传 TSP<=>TBOX
function bigdataUploadParser(buffer) {
  return new Parser()
    .array('timestamp', { type: 'uint8', length: 6 })
    .uint8('type', { assert: 1 })
    .uint8('id')
    .choice({
      tag: 'id',
      choices: {
        0x01: new Parser().uint32('totalLength').uint16('segmentLength'),
        0x11: new Parser().uint16('result'),
        0x12: new Parser().uint16('sequence'),
        0x02: new Parser()
          .uint16('sequence')
          .array('data', { length: buffer.length - 10 }),
        0x13: new Parser().uint16('result'),
        0x03: new Parser().uint8('result')
      }
    })
    .parse(buffer);
}

//======================Body Parser Entry==================================

//0x01 成功 接收到的信息正确
function responseMessageParser(message) {
  switch (message.command) {
    case 0x01://车辆登入 - 响应
      return loginResponseParser.parse(message.data);
    case 0x02://实时信息上报 - 响应
    case 0x03://补发信息上报 - 响应
      return realtimeInfoResponseParser.parse(message.data);
    case 0x04://车辆登出 - 响应
      return logoutResponsetParser.parse(message.data);
    case 0x07://心跳 - 响应
      return heartBeatParser.parse(message.data);
    case 0x08://终端校时 - 响应
      return timeCalibrationResponseParser.parse(message.data);
    case 0x09://链路连接 上行
      return linkConnectionResponseParser.parse(message.data);
    case 0x0A://信息绑定 上行
      return infoBindResponseParser.parse(message.data);
    case 0x0B://大数据上传
      return bigdataUploadParser(message.data);

    case 0x80://参数查询命令 下行
      return parameterGetResponseParser.parse(message.data);
    case 0x81://参数设置命令 下行
      return parameterSetResponseParser.parse(message.data);
    case 0x82://车载终端控制命令 下行
      return terminalControlResponseParser.parse(message.data);

    default:// others
      console.log('unknown command', message.command)
      return null;
  }
}

//0xFE 命令 表示数据包为命令包;而非应答包
function commandMessageParser(message) {
  switch (message.command) {
    case 0x01://车辆登入 上行
      return loginParser.parse(message.data);
    case 0x02://实时信息上报 上行
    case 0x03://补发信息上报 上行
      return realtimeInfoParser(message);
    case 0x04://车辆登出 上行
      return logoutParser.parse(message.data);
    case 0x07://心跳 上行
      return heartBeatParser.parse(message.data);
    case 0x08://终端校时 上行
      return timeCalibrationParser.parse(message.data);
    case 0x09://链路连接 上行
      return linkConnectionParser.parse(message.data);
    case 0x0A://信息绑定 上行
      return infoBindParser.parse(message.data);
    case 0x0B://大数据上传 上行
      return bigdataUploadParser(message.data);

    case 0x80://参数查询命令 下行
      return parameterGetParser.parse(message.data);
    case 0x81://参数设置命令 下行
      return parameterSetParser.parse(message.data);
    case 0x82://车载终端控制命令 下行/上行
      return terminalControlParser.parse(message.data);

    default:// others
      console.log('unknown command', message.command)
      return null;
  }
}
