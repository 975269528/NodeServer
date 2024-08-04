const { WebSocketServer} = require("ws");
const {ServerEvent} = require("./ServerEventManager");

//类对象存储
let classMap = {}

let ws = new WebSocketServer({port: 4001});
console.log('服务器启动成功,开始监听 4001...')

//启动服务器
module.exports.game_run = () => {
    ws.on('connection', (ws, req) => {
        console.log("用户[" + req.connection.remoteAddress + "] 进入连接");
        
        ws.on('message', (msg) => {
            try {
                //解析数据
                console.log(' message收到的原始消息', msg.toString())
                let {className, method, data} = JSON.parse(msg)
                //调用已注册方法
                let tag = new Struct(req.connection.remoteAddress, ws, className, method)
                this.game_call(tag, className, method, data)
                
            } catch (e) {
                console.log(e)
            }
        })
        ws.on('close', () => {
            ServerEvent.unsubscribe2(ws)
            console.log(' close用户断开连接' + req.connection.remoteAddress);
        })
        ws.on('error', (err) => {
            console.log(' error用户异常断开' + req.connection.remoteAddress);
            console.log(err);
        })
    })
}

//提供类对象实例
module.exports.game_reg = (classInstance) => {
    console.log(' game_reg已注册新类对象实例:', classInstance.constructor.name)
    classMap[classInstance.constructor.name] = classInstance
}

//调用类方法且传递参数
module.exports.game_call = (tag, className, method, data) => {
    //判断类方法是否存在
    try {
        if (typeof classMap[className][method] === 'function') {
            //调用类方法传递参数
            classMap[className][method](tag, data)
        }
    } catch (e) {
        console.log(' game_call发生错误:' + e)
    }
}

//发送消息到客户端
module.exports.game_send = (tag, data) => {
    try {
        tag.ws.send(JSON.stringify({
            eventName: 0,
            className: tag.className,
            method: tag.method,
            data: data
        }))
    } catch (e) {
        console.log(e)
    }
}


//标识结构
class Struct {
    fromUser
    ws
    className
    method
    
    constructor(from, websocket, classname, methodName) {
        this.fromUser = from
        this.ws = websocket
        this.className = classname
        this.method = methodName
    }
}