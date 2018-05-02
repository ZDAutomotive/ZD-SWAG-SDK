var Parser = require("binary-parser").Parser;

//============================Parser Entry========================================
module.exports.parse = function (buffer) {
  // try {
  let message = new Parser()
    .uint16("startDelimiter", { assert: 0x2e2e })
    .uint8("command")
    .uint8("response")
    .array("ICCID", { type: "uint8", length: 10 })
    .uint8("encryptionMethod", { assert: 0 })
    .uint16("serialNO")
    .uint16("dataLength")
    .buffer("data", { length: "dataLength" })
    .uint8("CRC")
    .parse(buffer);

  let messageBody = null;
  //console.log(message.data)

  if (message.dataLength > 0) {
    switch (message.response) {
      case 0x01://成功
      case 0x02://修改错
        messageBody = responseParser(message);
        break;
      case 0xfe://命令
        messageBody = commandParser(message);
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

var common_locationDataParser = new Parser()
  .array("status", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("validity")
      .bit1("latitude")
      .bit1("longitude")
      .bit5("reserved"),
    formatter: function (value) {
      return value[0];
    }
  })
  .array("timestamp", { type: "uint8", length: 6 })
  .uint32("longitudeValue")
  .uint32("latitudeValue")
  .uint16("velocity")
  .uint16("direction")
  .uint16("altitude")
  .array("reserved", { type: "uint8", length: 2 });

var common_vehicleStatusParser = new Parser()
  .array("alarm", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("bit0") //BIT0=1: 未定义
      .bit1("bit1") //BIT1=1: 馈电报警
      .bit1("bit2") //BIT2=1: 欠压报警
      .bit1("bit3") //BIT3=1: 车辆胎压异常报警
      .bit1("bit4") //BIT4=1: 碰撞报警
      .bit1("bit5") //BIT5=1: 异动报警
      .bit1("bit6") //BIT6=1: 盗警
      .bit1("bit7"), //BIT7=1: 车载终端主电被切断
    formatter: function (value) {
      return value[0];
    }
  })
  .array("lamp", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("bit0") //(0:关闭,1:右灯,2:左灯,3:危险灯)
      .bit2("bit1_2") //BIT2-BIT1: 转向灯(0:关闭,1:右灯,2:左灯,3:危险灯)
      .bit1("bit3") //BIT3=1: 前雾灯(0:关闭,1:打开)
      .bit1("bit4") //BIT4=1: 后雾灯(0:关闭,1:打开)
      .bit1("bit5") //BIT5=1: 位置灯(0:关闭,1:打开)
      .bit1("bit6") //BIT6=1: 近光灯(0:关闭,1:打开)
      .bit1("bit7"), //BIT7=1: 远光灯(0:关闭,1:打开)
    formatter: function (value) {
      return value[0];
    }
  })
  .array("door", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("bit0") //BIT0=1: 未定义
      .bit1("bit1") //BIT1=1: 未定义
      .bit1("bit2") //BIT2=1: 发 动 机 舱 盖 ( 0 : 关闭, 1:打开)
      .bit1("bit3") //BIT3=1: 后备箱(0:关闭,1:打开)
      .bit1("bit4") //BIT4=1: 右后门(0:关闭,1:打开)
      .bit1("bit5") //BIT5=1: 左后门(0:关闭,1:打开)
      .bit1("bit6") //BIT6=1: 右前门(0:关闭,1:打开)
      .bit1("bit7"), //BIT7=1: 左前门(0:关闭,1:打开)
    formatter: function (value) {
      return value[0];
    }
  })
  .array("gear", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("D") //BIT0=1: D
      .bit1("R") //BIT1=1: R
      .bit1("N") //BIT2=1: N
      .bit1("P") //BIT3=1: P
      .bit1("bit4") //BIT4=1: 未定义
      .bit1("bit5") //BIT5=1: 未定义
      .bit1("bit6") //BIT6=1: 未定义
      .bit1("bit7"), //BIT7=1: 未定义
    formatter: function (value) {
      return value[0];
    }
  })
  .array("other", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("bit0") ////BIT0=1: 未定义
      .bit1("aircondition") //BIT1=1: 空调开关(0:关闭,1:打开)
      .bit1("PEPS") //BIT2=1: PEPS 状 态 ( 0 : 无PEPS,1:有 PEPS,默认为 1)
      .bit3("power") //BIT3-BIT5: 电源(0 : Off , 1 : Acc , 2 : On , 3 :Start)
      .bit1("bit6") //BIT6=1: 未定义
      .bit1("airbag"), //BIT7=1: 安全气囊状态(0:关闭;1 打开)
    formatter: function (value) {
      return value[0];
    }
  });

var common_terminalInfoParser = new Parser()
  .array("softwareVersion", { type: "uint8", length: 4 })
  .array("hardwareVersion", { type: "uint8", length: 4 })
  .array("VIN", { type: "uint8", length: 17 })
  .array("barcode", { type: "uint8", length: 26 })
  .array("productionDate", { type: "uint8", length: 6 })
  .array("releaseDate", { type: "uint8", length: 6 })
  .array("updateDate", { type: "uint8", length: 6 });

var common_dashboardInfoParser = new Parser()
  .uint8("instantConsumption")
  .uint16("tripAFuelConsumption")
  .uint16("tripBFuelConsumption")
  .uint16("remainedFuel")
  .array("totalMilage", { type: "uint8", length: 3 })
  .uint8("waterTemperature")
  .uint16("rotationSpeed")
  .uint16("velocity")
  .uint16("tripAMilage")
  .uint16("tripBMilage")
  .uint8("displayMode")
  .uint8("communicationSignal");

var common_dashboardInfo2Parser = new Parser().array("totalMilage", {
  type: "uint8",
  length: 3
});

var common_dashboardInfo3Parser = new Parser()
  .uint8("instantConsumption")
  .uint16("tripAFuelConsumption")
  .uint16("tripBFuelConsumption")
  .uint16("remainedFuel")
  .array("totalMilage", { type: "uint8", length: 3 })
  .uint8("waterTemperature")
  .uint16("rotationSpeed")
  .uint16("velocity")
  .uint16("tripAMilage")
  .uint16("tripBMilage")
  .uint8("displayMode")
  .uint8("communicationSignal")

  .uint8("frontleft_tyrepressure_valid")
  .uint8("frontleft_tyrepressure_status")
  .uint8("frontright_tyrepressure_valid")
  .uint8("frontright_tyrestatus_status")
  .uint8("rearleft_tyrepressure_valid")
  .uint8("rearleft_tyrepressure_status")
  .uint8("rearright_tyrepressure_valid")
  .uint8("rearright_tyrestatus_status")

  .uint8("frontleft_tyrepressure")
  .uint8("frontright_tyrestatus")
  .uint8("rearleft_tyrepressure")
  .uint8("rearright_tyrestatus");

var common_UBIParser = new Parser()
  .uint8("instantConsumption")
  .uint16("tripAFuelConsumption")
  .uint16("tripBFuelConsumption")
  .uint16("remainedFuel")
  .array("totalMilage", { type: "uint8", length: 3 })
  .uint8("waterTemperature")
  .array("rotationSpeed", { type: "uint16be", length: 15 })
  .array("velocity", { type: "uint16be", length: 15 })
  .array("wheelPosition", { type: "uint16be", length: 15 })
  .array("wheelRotationSpeed", { type: "uint16be", length: 15 })
  .array("accleration", { type: "uint16be", length: 15 })
  .array("gear", { type: "uint8", length: 15 })

  .uint8("frontleft_tyrepressure_valid")
  .uint8("frontleft_tyrepressure_status")
  .uint8("frontright_tyrepressure_valid")
  .uint8("frontright_tyrestatus_status")
  .uint8("rearleft_tyrepressure_valid")
  .uint8("rearleft_tyrepressure_status")
  .uint8("rearright_tyrepressure_valid")
  .uint8("rearright_tyrestatus_status")

  .uint8("frontleft_tyrepressure")
  .uint8("frontright_tyrestatus")
  .uint8("rearleft_tyrepressure")
  .uint8("rearright_tyrestatus");

var common_UBIVehicleParser = new Parser()
  .array("alarm", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("bit0") //BIT0=1: 未定义
      .bit1("bit1") //BIT1=1: 馈电报警
      .bit1("bit2") //BIT2=1: 欠压报警
      .bit1("bit3") //BIT3=1: 车辆胎压异常报警
      .bit1("bit4") //BIT4=1: 碰撞报警
      .bit1("bit5") //BIT5=1: 异动报警
      .bit1("bit6") //BIT6=1: 盗警
      .bit1("bit7"), //BIT7=1: 车载终端主电被切断
    formatter: function (value) {
      return value[0];
    }
  })
  .array("lamp", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("bit0") //(0:关闭,1:右灯,2:左灯,3:危险灯)
      .bit2("bit1_2") //BIT2-BIT1: 转向灯(0:关闭,1:右灯,2:左灯,3:危险灯)
      .bit1("bit3") //BIT3=1: 前雾灯(0:关闭,1:打开)
      .bit1("bit4") //BIT4=1: 后雾灯(0:关闭,1:打开)
      .bit1("bit5") //BIT5=1: 位置灯(0:关闭,1:打开)
      .bit1("bit6") //BIT6=1: 近光灯(0:关闭,1:打开)
      .bit1("bit7"), //BIT7=1: 远光灯(0:关闭,1:打开)
    formatter: function (value) {
      return value[0];
    }
  })
  .array("door", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("bit0") //BIT0=1: 未定义
      .bit1("bit1") //BIT1=1: 未定义
      .bit1("bit2") //BIT2=1: 发 动 机 舱 盖 ( 0 : 关闭, 1:打开)
      .bit1("bit3") //BIT3=1: 后备箱(0:关闭,1:打开)
      .bit1("bit4") //BIT4=1: 右后门(0:关闭,1:打开)
      .bit1("bit5") //BIT5=1: 左后门(0:关闭,1:打开)
      .bit1("bit6") //BIT6=1: 右前门(0:关闭,1:打开)
      .bit1("bit7"), //BIT7=1: 左前门(0:关闭,1:打开)
    formatter: function (value) {
      return value[0];
    }
  })
  .array("gear", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit4("bit0_3") //BIT3-0 档位
      .bit1("bit4") //BIT4 1:制动有效 0:制动无效
      .bit1("bit5") //BIT5=1: 1:驱动有效 0:驱动无效
      .bit1("bit6") //BIT6=1: 未定义
      .bit1("bit7"), //BIT7=1: 未定义
    formatter: function (value) {
      return value[0];
    }
  })
  .array("other", {
    lengthInBytes: 1,
    type: new Parser()
      .endianess("little")
      .bit1("bit0") ////BIT0=1: 未定义
      .bit1("aircondition") //BIT1=1: 空调开关(0:关闭,1:打开)
      .bit1("PEPS") //BIT2=1: PEPS 状 态 ( 0 : 无PEPS,1:有 PEPS,默认为 1)
      .bit3("power") //BIT3-BIT5: 电源(0 : Off , 1 : Acc , 2 : On , 3 :Start)
      .bit1("bit6") //BIT6=1: 未定义
      .bit1("airbag"), //BIT7=1: 安全气囊状态(0:关闭;1 打开)
    formatter: function (value) {
      return value[0];
    }
  });

var common_failureLampParser = new Parser().uint8("length").array("lamps", {
  length: function () {
    return this.length - 1;
  },
  type: new Parser()
    .endianess("little")
    .bit1("bit0") //BIT0
    .bit1("bit1") //BIT1
    .bit1("bit2") //BIT2
    .bit1("bit3") //BIT3
    .bit1("bit4") //BIT4
    .bit1("bit5") //BIT5
    .bit1("bit6") //BIT6
    .bit1("bit7") //BIT7
});

var common_vehicleReportTypeParser = new Parser()
  .uint8("type")
// .uint16("length")
// .array("value", { type: "uint8", lengthInBytes: "length" });

var common_configurationResultParser = new Parser()
  .uint8("type")
  .uint8("allow")
  .uint16("result");

var common_vehicleFailureParser = new Parser()
  .uint16("length")
  .array("failures", {
    lengthInBytes: function () {
      return this.length - 2;
    },
    type: new Parser()
      .uint8("type")
      .uint16("count")
      .array("codes", {
        length: "count",
        type: new Parser().array("code", { type: "uint8", length: 3 })
      })
  });

var common_complementInfoParser = new Parser();

//===========================Realtime Info Parser=========================================
//实时信息上报 上行
function realtimeInfoParser(message) {
  return new Parser()
    .array("timestamp", { type: "uint8", lengthInBytes: 6 })
    .array("infos", {
      lengthInBytes: message.dataLength - 6,
      type: new Parser()
        .uint8("tag")
        .choice({
          tag: "tag",
          defaultChoice: new Parser(),
          formatter: function (data) {
            let tag = data.tag;
            delete data.tag;
            return { tag, value: data };
          },
          choices: {
            0x04: common_locationDataParser, //卫星定位系统数据
            //0x05: complementInfoParser,//补发信息上报
            0x80: common_vehicleStatusParser, //车辆状态信息
            0x81: common_dashboardInfoParser, //仪表信息
            0x82: common_vehicleFailureParser, //车辆故障信息
            0x83: common_terminalInfoParser, //车辆终端信息
            0x84: common_failureLampParser, //车辆故障灯信息
            0x85: common_vehicleReportTypeParser, //车辆上报数据类型
            0x86: common_dashboardInfo2Parser, //仪表信息 2
            0x87: common_dashboardInfo3Parser, //仪表信息 3
            0x88: common_UBIParser, //UBI 信息
            0x89: common_UBIVehicleParser, //UBI 车辆状态
            0x8a: common_configurationResultParser //受控车辆设置结果
          }
        })
    })
    .parse(message.data);
}

var realtimeInfoResponseParser = new Parser();

//心跳 (无内容)
var heartBeatParser = new Parser();

//登陆 TBOX->TSP
var loginParser = new Parser()
  .array("type", { type: "uint8", length: 12 })
  .array("VIN", { type: "uint8", length: 17 })
  .array("version", { type: "uint8", length: 4 })
  .array("code", {
    type: "uint8",
    length: 12,
    formatter: function (data) {
      return {
        vendorCode: data.slice(0, 4),
        batchNO: data.slice(4, 10),
        serialNO: Number(
          data
            .slice(10, 12)
            .reverse()
            .join("")
        )
      };
    }
  });

//登陆响应 TSP->TBOX
var loginResponseParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .uint16("result");

//退录 (无内容)
var logoutParser = new Parser();

var logoutResponsetParser = new Parser();

//远程升级 上行
var remoteUpdateParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .uint8("command")
  .choice({
    tag: "command",
    choices: {
      //网关下发升级请求 TSP->TBOX
      0x01: new Parser()
        .array("ftpServer", { type: "uint8", length: 4 })
        .uint16("port")
        .array("account", { type: "uint8", length: 32 })
        .array("password", { type: "uint8", length: 16 })
        .array("fileName", { type: "uint8", length: 20 })
        .uint32("fileLength"),
      //终端应答升级请求 TBOX->TSP
      0x11: new Parser().uint16("result"),
      //终端上报升级状态 TBOX->TSP
      0x12: new Parser().uint16("result"),
      //网关应答升级状态 TSP->TBOX
      0x12: new Parser().uint16("result")
    }
  });

//参数查询命令 下行 TSP->TBOX
var parameterGetParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .uint8("count")
  .array("params", { type: "uint8", length: "count" });

//参数查询 响应命令 TBOX->TSP
var parameterGetResponseParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .uint8("count")
  .array("params", {
    length: "count",
    type: new Parser()
      .uint8("id")
      .choice({
        tag: "id",
        choices: {
          0x0b: new Parser() //服务中心号码
            .array("data", { type: "uint8", length: 16 })
            .uint16("result"),
          0x0c: new Parser()
            .array("data", { type: "uint8", length: 25 })
            .uint16("result"), //短信业务中心号码,上行号码
          0x0d: new Parser()
            .array("data", { type: "uint8", length: 25 })
            .uint16("result"), //短信业务中心号码,下行号码
          0x0e: new Parser()
            .array("data", { type: "uint8", length: 16 })
            .uint16("result"), //E-CALL 服务电话
          0x0f: new Parser()
            .array("data", { type: "uint8", length: 16 })
            .uint16("result"), //I-CALL 服务电话
          0x10: new Parser().uint8("data").uint16("result"), //ACC 是否上报,0-关闭,1- 开启
          0x11: new Parser().uint8("data").uint16("result"), //休眠是否上报,0-关闭,1- 开启
          0x12: new Parser().uint8("data").uint16("result"), //关机是否上报,0-关闭,1- 开启
          0x13: new Parser().uint8("data").uint16("result"), //车身变化是否上报,0-关闭,1- 开启
          0x14: new Parser().uint8("data").uint16("result"), //故障是否上报,0-关闭,1- 开启
          //受控车辆配置结果
          0x16: new Parser()
            .uint8("type") //0,表示PEPS 使能标志设置 1,表示 T-BOX 与 PEPS 本地认证使能标志位设置
            .uint8("data") //0,禁止 1,允许
            .uint16("result"), //配置结果
          //数据采集信息
          0x17: new Parser()
            .uint8("count") //需要采集的参数个数
            .uint16("duration") //需要采集的时间,单位:秒
            .array("data", { type: "uint16be", length: "count" }) //数据采集的 CAN ID n
            .uint16("result"),
          //音响主机连接状态,0-关闭,1- 开启
          0x18: new Parser().uint8("data").uint16("result"),
          //定时上报信息,0-关闭,非 0-上报间隔,单位:秒
          0x19: new Parser().uint16("data").uint16("result"),
          //车辆终端信息,数据格式和定义见表 17
          0x1a: new Parser()
            .array("softwareVersion", { type: "uint8", length: 4 })
            .array("hardwareVersion", { type: "uint8", length: 4 })
            .array("VIN", { type: "uint8", length: 17 })
            .array("barcode", { type: "uint8", length: 26 })
            .array("productionDate", { type: "uint8", length: 6 })
            .array("releaseDate", { type: "uint8", length: 6 })
            .array("updateDate", { type: "uint8", length: 6 })
            .uint16("result"),
          //主服务器网络参数,数据格式和定义见表 27
          0x1b: new Parser()
            .uint32("ip")
            .uint16("port")
            .uint16("result"),
          //从服务器网络参数,数据格式和定义见表 27
          0x1c: new Parser()
            .uint32("ip")
            .uint16("port")
            .uint16("result"),
          //一键导航目的地下发参数,数据格式见表 28
          // !!! NEEDS BUF FIX
          0x1d: new Parser()
            .array('data', {
              lengthInBytes: 81,
              formatter: function (data) { return data[0] },
              type: new Parser()
                .uint8("mothed") //0:系统推荐,1:高速优先,2:一般公路优先,3:最短时间,4:最短距离
                .array("dstPOI", { type: "uint8", length: 32 }) //目的地 POI 名称
                .uint32("dstLatitude") //单位:千万分之一度,保留小数点后 7 位
                .uint32("dstLongitude") //单位:千万分之一度,保留小数点后 7 位
                .array("viaPOI1", { type: "uint8", length: 32 })
                .uint32("viaPOI1Latitude") //单位:千万分之一度,保留小数点后 7 位
                .uint32("viaPOI1Longitude") //单位:千万分之一度,保留小数点后 7 位
              // .array("viaPOI2", { type: "uint8", length: 32 })
              // .uint32("viaPOI2Latitude") //单位:千万分之一度,保留小数点后 7 位
              // .uint32("viaPOI2Longitude") //单位:千万分之一度,保留小数点后 7 位
              // .array("viaPOI3", { type: "uint8", length: 32 })
              // .uint32("viaPOI3Latitude") //单位:千万分之一度,保留小数点后 7 位
              // .uint32("viaPOI3Longitude") //单位:千万分之一度,保留小数点后 7 位
            })
            .uint16("result"),
          //更新推送信息参数(需传送给 MP5) 0-不更新,1-更新
          0x1e: new Parser().uint8("data").uint16("result"),
          //URL 数据信息,数据格式见表 26
          0x1f: new Parser()
            .uint8("textOrPicture") //文本还是图片 0:文本,1:图片
            .uint8("allowPopup") //弹屏标志 0:不弹屏,1:弹屏
            .array("data", { type: "uint8", length: 256 })
            .uint16("result"),
          //定时上报内容 查询/设置 0:表示普通定时上报;1:表示 UBI 数据上报
          0x20: new Parser().uint8("data").uint16("result"),
          //T-BOX 的 APN 参数信息
          0x21: new Parser()
            .array("data", { type: "uint8", length: 32 })
            .uint16("result"),
          //HU 的 APN 参数信息
          0x22: new Parser()
            .array("data", { type: "uint8", length: 32 })
            .uint16("result"),
          //PEPS 使能标志位0:禁止 PEPS 启动;1:允许 PEPS 启动(默认)
          0x23: new Parser().uint8("data").uint16("result"),
          //T-BOX 与 PEPS 本地认证使能标志位
          // 0:车辆启动时禁止与 PEPS 进行安全认证
          // 1:车辆启动时允许与 PEPS 进行安全认证
          0x24: new Parser().uint8("data").uint16("result"),
          //T-BOX 复位 3G 模块 0:不复位;1:复位
          0x25: new Parser().uint8("data").uint16("result"),
          //T-BOX 复位功能 0:不复位;1:复位
          0x26: new Parser().uint8("data").uint16("result"),
          //T-BOX 自动绑定功能 0:不动作;1:上报自动绑定报文
          0x27: new Parser().uint8("data").uint16("result")
        }
      })
  });

//参数设置命令 TSP->TBOX
var parameterSetParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .uint8("count")
  .array("params", {
    length: "count",
    type: new Parser()
      .uint8("id")
      .choice({
        tag: "id",
        choices: {
          //服务中心号码
          0x0b: new Parser().array("data", { type: "uint8", length: 16 }),
          0x0c: new Parser().array("data", { type: "uint8", length: 25 }), //短信业务中心号码,上行号码
          0x0d: new Parser().array("data", { type: "uint8", length: 25 }), //短信业务中心号码,下行号码
          0x0e: new Parser().array("data", { type: "uint8", length: 16 }), //E-CALL 服务电话
          0x0f: new Parser().array("data", { type: "uint8", length: 16 }), //I-CALL 服务电话
          0x10: new Parser().uint8("data"), //ACC 是否上报,0-关闭,1- 开启
          0x11: new Parser().uint8("data"), //休眠是否上报,0-关闭,1- 开启
          0x12: new Parser().uint8("data"), //关机是否上报,0-关闭,1- 开启
          0x13: new Parser().uint8("data"), //车身变化是否上报,0-关闭,1- 开启
          0x14: new Parser().uint8("data"), //故障是否上报,0-关闭,1- 开启
          //受控车辆配置结果
          0x16: new Parser()
            .uint8("type") //0,表示PEPS 使能标志设置 1,表示 T-BOX 与 PEPS 本地认证使能标志位设置
            .uint8("data") //0,禁止 1,允许
            .uint16("result"), //配置结果
          //数据采集信息
          0x17: new Parser()
            .uint8("count") //需要采集的参数个数
            .uint16("duration") //需要采集的时间,单位:秒
            .array("data", { type: "uint16be", length: "count" }), //数据采集的 CAN ID n
          //音响主机连接状态,0-关闭,1- 开启
          0x18: new Parser().uint8("data"),
          //定时上报信息,0-关闭,非 0-上报间隔,单位:秒
          0x19: new Parser().uint16("data"),
          //车辆终端信息,数据格式和定义见表 17
          0x1a: new Parser()
            .array("softwareVersion", { type: "uint8", length: 4 })
            .array("hardwareVersion", { type: "uint8", length: 4 })
            .array("VIN", { type: "uint8", length: 17 })
            .array("barcode", { type: "uint8", length: 26 })
            .array("productionDate", { type: "uint8", length: 6 })
            .array("releaseDate", { type: "uint8", length: 6 })
            .array("updateDate", { type: "uint8", length: 6 }),
          //主服务器网络参数,数据格式和定义见表 27
          0x1b: new Parser().uint32("ip").uint16("port"),
          //从服务器网络参数,数据格式和定义见表 27
          0x1c: new Parser().uint32("ip").uint16("port"),
          //一键导航目的地下发参数,数据格式见表 28
          // !!! NEEDS BUF FIX
          0x1d: new Parser()
            .array('data', {
              lengthInBytes: 81, //type: 'uint8'
              formatter: function (data) { return data[0] },
              type: new Parser()
                .uint8("mothed") //0:系统推荐,1:高速优先,2:一般公路优先,3:最短时间,4:最短距离
                .array("dstPOI", { type: "uint8", length: 32 }) //目的地 POI 名称
                .uint32("dstLatitude") //单位:千万分之一度,保留小数点后 7 位
                .uint32("dstLongitude") //单位:千万分之一度,保留小数点后 7 位
                .array("viaPOI1", { type: "uint8", length: 32 })
                .uint32("viaPOI1Latitude") //单位:千万分之一度,保留小数点后 7 位
                .uint32("viaPOI1Longitude") //单位:千万分之一度,保留小数点后 7 位
              // .array("viaPOI2", { type: "uint8", length: 32 })
              // .uint32("viaPOI2Latitude") //单位:千万分之一度,保留小数点后 7 位
              // .uint32("viaPOI2Longitude") //单位:千万分之一度,保留小数点后 7 位
              // .array("viaPOI3", { type: "uint8", length: 32 })
              // .uint32("viaPOI3Latitude") //单位:千万分之一度,保留小数点后 7 位
              // .uint32("viaPOI3Longitude") //单位:千万分之一度,保留小数点后 7 位
            }),
          //更新推送信息参数(需传送给 MP5) 0-不更新,1-更新
          0x1e: new Parser().uint8("data"),
          //URL 数据信息,数据格式见表 26
          0x1f: new Parser()
            .uint8("textOrPicture") //文本还是图片 0:文本,1:图片
            .uint8("allowPopup") //弹屏标志 0:不弹屏,1:弹屏
            .array("data", { type: "uint8", length: 256 }),
          //定时上报内容 查询/设置 0:表示普通定时上报;1:表示 UBI 数据上报
          0x20: new Parser().uint8("data"),
          //T-BOX 的 APN 参数信息
          0x21: new Parser().array("data", { type: "uint8", length: 32 }),
          //HU 的 APN 参数信息
          0x22: new Parser().array("data", { type: "uint8", length: 32 }),
          //PEPS 使能标志位0:禁止 PEPS 启动;1:允许 PEPS 启动(默认)
          0x23: new Parser().uint8("data"),
          //T-BOX 与 PEPS 本地认证使能标志位
          // 0:车辆启动时禁止与 PEPS 进行安全认证
          // 1:车辆启动时允许与 PEPS 进行安全认证
          0x24: new Parser().uint8("data"),
          //T-BOX 复位 3G 模块 0:不复位;1:复位
          0x25: new Parser().uint8("data"),
          //T-BOX 复位功能 0:不复位;1:复位
          0x26: new Parser().uint8("data"),
          //T-BOX 自动绑定功能 0:不动作;1:上报自动绑定报文
          0x27: new Parser().uint8("data")
        }
      })
  });

//参数设置应答 TBOX->TSP
var parameterSetResponseParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .uint8("count")
  .array("params", {
    length: "count",
    type: new Parser()
      .uint8("id")
      .uint16("result")
  });

//车载终端控制命令 TSP->TBOX
var terminalControlParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .uint8("id")
  .choice({
    tag: "id",
    choices: {
      0x80: new Parser()
        .uint8("command")
        .choice({
          tag: "command",
          choices: {
            //中控锁控制指令 0:表示无动作 1:表示开锁 2:表示关锁
            0x01: new Parser().array("param", { type: "uint8", length: 1 }),
            //车窗控制指令,车窗控制参数数据格式和定义见表 38
            //BYTE[0]: 车窗位置 0:表示无动作,1:左前窗,2:右前窗,3:左后窗,4:右后窗
            //BYTE[1]:车窗状态 0:表示无动作 1:表示开窗 2:表示关窗
            0x02: new Parser().array("param", { type: "uint8", length: 2 }),
            //空调控制指令: 0:表示无动作 1:表示加热 2:表示制冷 3:表示关空调
            0x03: new Parser().array("param", { type: "uint8", length: 1 }),
            //天窗控制指令: 0:表示无动作 1:表示开天窗 2:表示关天窗
            0x04: new Parser().array("param", { type: "uint8", length: 1 }),
            //寻车控制指令 0:表示无动作 1:表示寻车
            0x05: new Parser().array("param", { type: "uint8", length: 1 }),
            //故障诊断控制指令 0:表示无动作 1:表示开始诊断
            0x06: new Parser().array("param", { type: "uint8", length: 1 }),
            //远程启动 BYTE[0]: 0-不动作,1-启动 BYTE[1]:远程启动定时熄火时间,单位:分
            0x07: new Parser().array("param", { type: "uint8", length: 2 }),
            //远程熄火 0-不动作;1-远程熄火
            0x08: new Parser().array("param", { type: "uint8", length: 1 }),
            // 查车 0-不动作,1-查车
            0x09: new Parser().array("param", { type: "uint8", length: 1 })
          }
        })
      //0x80~0xFE: 用户自定义
    }
  });

//车载终端控制响应 TBOX->TSP
var terminalControlResponseParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .uint8("id")
  .choice({
    tag: "id",
    choices: {
      0x80: new Parser()
        .uint8("command")
        .choice({
          tag: "command",
          choices: {
            //中控锁控制指令返回结果
            0x01: new Parser()
              .array('param', { type: 'uint8', length: 1 })
              .uint16("result"),
            //车窗控制指令
            0x02: new Parser()
              .array('param', { type: 'uint8', length: 2 })
              .uint16("result"),
            //空调控制指令返回结果
            0x03: new Parser()
              .array('param', { type: 'uint8', length: 1 })
              .uint16("result"),
            //天窗控制指令返回结果
            0x04: new Parser()
              .array('param', { type: 'uint8', length: 1 })
              .uint16("result"),
            //寻车控制指令返回结果
            0x05: new Parser()
              .array('param', { type: 'uint8', length: 1 })
              .uint16("result"),
            //故障诊断控制指令返回结果
            0x06: new Parser()
              .array('param', { type: 'uint8', length: 1 })
              .uint16("length")
              .array("result", {
                lengthInBytes: function () {
                  return this.length - 2;
                },
                type: new Parser()
                  .uint8("type")
                  .uint16("count")
                  .array("codes", {
                    length: "count",
                    type: new Parser().array("code", { type: "uint8", length: 3 })
                  })
              }),
            //远程启动返回结果
            0x07: new Parser()
              .array('param', { type: 'uint8', length: 2 })
              .uint16("result"),
            //远程熄火返回结果
            0x08: new Parser()
              .array('param', { type: 'uint8', length: 1 })
              .uint16("result"),
            // 查车返回结果
            0x09: new Parser()
              .array("result", {
                lengthInBytes: 6 + 1 + 23 + 6 + 33,
                formatter: function (data) {
                  return data[0];
                },
                type: new Parser()
                  .array("locationData", {
                    lengthInBytes: 23,
                    type: common_locationDataParser,
                    formatter: function (data) {
                      return data[0];
                    }
                  })
                  .array("vehicleStatus", {
                    lengthInBytes: 6,
                    type: common_vehicleStatusParser,
                    formatter: function (data) {
                      return data[0];
                    }
                  })
                  .array("dashboardInfo3", {
                    lengthInBytes: 33,
                    type: common_dashboardInfo3Parser,
                    formatter: function (data) {
                      return data[0];
                    }
                  })
              })
          }
        })
      //0x80~0xFE: 用户自定义
    }
  });

//链路连接 TBOX->TSP
var linkConnectionParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .array("locationData", {
    lengthInBytes: 23,
    type: common_locationDataParser,
    formatter: function (data) {
      return data[0];
    }
  })
  .array("tboxBarcode", { type: "uint8", length: 26 });

//链路连接应答 TSP-> TBOX
var linkConnectionResponseParser = new Parser().uint8("result");

//信息绑定 TBOX->TSP
var infoBindParser = new Parser()
  .array("timestamp", { type: "uint8", length: 6 })
  .array("locationData", {
    lengthInBytes: 23,
    type: common_locationDataParser,
    formatter: function (data) {
      return data[0];
    }
  })
  .array("tboxBarcode", { type: "uint8", length: 26 })
  .array("VIN", { type: "uint8", length: 17 });

//信息绑定应答 TSP-> TBOX
var infoBindResponseParser = new Parser().uint16("result");

//大数据上传 TSP<=>TBOX
function bigdataUploadParser(buffer) {
  return new Parser()
    .array("timestamp", { type: "uint8", length: 6 })
    .uint8("type", { assert: 1 })
    .uint8("id")
    .choice({
      tag: "id",
      choices: {
        0x01: new Parser().uint32("totalLength").uint16("segmentLength"),
        0x11: new Parser().uint16("result"),
        0x12: new Parser().uint16("serialNO"),
        0x02: new Parser()
          .uint16("serialNO")
          .array("data", { length: buffer.length - 10 }),
        0x13: new Parser().uint16("result"),
        0x03: new Parser().uint8("result")
      }
    })
    .parse(buffer);
}

//POI 数据查询 上行
var poiGetParser = new Parser();

//======================Body Parser Entry==================================

//0x01 成功 接收到的信息正确
function responseParser(message) {
  switch (message.command) {
    //实时信息上报 上行
    case 0x02:
      return realtimeInfoResponseParser.parse(message.data);
    //心跳 上行
    case 0x04:
      return heartBeatParser.parse(message.data);
    //补发信息上报 上行
    case 0x05:
      return realtimeInfoResponseParser.parse(message.data);
    //登陆 上行
    case 0x06:
      return loginResponseParser.parse(message.data);
    //退录 上行
    case 0x07:
      return logoutResponsetParser.parse(message.data);
    //远程升级 上行
    case 0x08:
      return remoteUpdateParser.parse(message.data);
    //参数查询命令 下行
    case 0x80:
      return parameterGetResponseParser.parse(message.data);
    //参数设置命令 下行
    case 0x81:
      return parameterSetResponseParser.parse(message.data);
    //车载终端控制命令 下行
    case 0x82:
      return terminalControlResponseParser.parse(message.data);
    //链路连接 上行
    case 0x83:
      return linkConnectionResponseParser.parse(message.data);
    //信息绑定 上行
    case 0x84:
      return infoBindResponseParser.parse(message.data);
    //大数据上传 上行
    case 0x85:
      return bigdataUploadParser(message.data);
    //POI 数据查询 上行
    case 0x86:
      return poiGetParser.parse(message.data);
    // others
    default:
      return null;
  }
}

//0xFE 命令 表示数据包为命令包;而非应答包
function commandParser(message) {
  switch (message.command) {
    //实时信息上报 上行
    case 0x02:
      return realtimeInfoParser(message);
    //心跳 上行
    case 0x04:
      return heartBeatParser.parse(message.data);
    //补发信息上报 上行
    // 当数据通信链路异常时, 车载终端应将实时上报数据进行本地存储。在数据通信链路恢复
    // 正常后, 在发送实时上报数据的同时补发存储的上报数据。补发的上报数据应为当日通信
    // 链路异常期间存储的数据, 数据格式与实时上报数据 相同, 并标识为补发信息上报(0x05)
    case 0x05:
      return realtimeInfoParser(message);
    //登陆 上行
    case 0x06:
      return loginParser.parse(message.data);
    //退录 上行
    case 0x07:
      return logoutParser.parse(message.data);
    //远程升级 上行
    case 0x08:
      return remoteUpdateParser.parse(message.data);
    //参数查询命令 下行
    case 0x80:
      return parameterGetParser.parse(message.data);
    //参数设置命令 下行
    case 0x81:
      //return parametersSetParser(message.data)
      return parameterSetParser.parse(message.data);
    //车载终端控制命令 下行
    case 0x82:
      return terminalControlParser.parse(message.data);
    //链路连接 上行
    case 0x83:
      return linkConnectionParser.parse(message.data);
    //信息绑定 上行
    case 0x84:
      return infoBindParser.parse(message.data);
    //大数据上传 上行
    case 0x85:
      return bigdataUploadParser(message.data);
    //POI 数据查询 上行
    case 0x86:
      return poiGetParser.parse(message.data);
    // others
    default:
      return null;
  }
}
