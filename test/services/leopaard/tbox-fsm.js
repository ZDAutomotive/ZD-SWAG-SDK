module.exports.fvMessageProcess = async function (message, context) {
    console.log(message)
    switch (message.command) {
        case 0x02://实时信息上报 上行
        case 0x04://心跳 上行
        case 0x05://补发信息上报 上行
        case 0x06://登陆 上行
        case 0x07://退录 上行
        case 0x08://远程升级 上行
        case 0x80://参数查询命令 下行
        case 0x81://参数设置命令 下行
            break

        case 0x82://车载终端控制命令 下行
            return await fvHandleTerminalControlMessage(message, context)

        case 0x83://链路连接 上行
        case 0x84://信息绑定 上行
        case 0x85://大数据上传 上行
        case 0x86://POI 数据查询 上行
            break
    }
    return null
}

async function fvHandleTerminalControlMessage(message, context) {
    let response = message
    switch (message.data.command) {
        case 1:
            //send CAN MSG to unlock the door
            message.TYPE = 'UNLOCK'
            try {
                if (message.data.param[0] == 1 && context.cansim) {
                    if (await context.cansim.start()) {
                        await context.cansim.setDataByName(0x52d, 'TBOX_RemoteBCMControlLockReq', 1)
                        await context.cansim.setCycleTime(0x52d, 0)
                    }
                    //send CAN MSG to lock the door
                } else if (message.data.param[0] == 2 && context.cansim) {
                    if (await context.cansim.start()) {
                        await context.cansim.setDataByName(0x52d, 'TBOX_RemoteBCMControlLockReq', 2)
                        await context.cansim.setCycleTime(0x52d, 0)
                    }
                } else { }
                response.response = 1
                response.data.result = 0
            } catch (err) {
                response.response = 2
                response.data.result = 1
            }

            response.dataLength += 2
            return response;

        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            break
    }
    return null
}
