const { WebSocketServer} = require("ws");
const {ServerEvent} = require("./ServerEventManager");

//事件循环是否开启
let eventLoop = false
//事件循环函数
let eventFunc = []
//类对象存储
let classMap = {}
//Websocket服务端对象
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

//开启事件循环 delay = 间隔毫秒
module.exports.game_openEventLoop = (delay)=>{
    //如果已开启则忽略操作
    if(!eventLoop)
    {
        //限制一下,防止设置过快,1秒60帧约等于16毫秒间隔,可以用了
        delay = delay < 16 ? 16 : delay
        eventLoop = true
        setInterval(()=>{
            //需要重复执行的函数
            eventFunc.forEach((func)=>{
                func()
            })
        },delay)
    }
}

//添加定时循环函数
module.exports.game_addEventLoopFunc = (handler)=>{
    //检查是否已存在,不存在则添加
    if(!eventFunc.includes(handler)){
        eventFunc.push(handler)
    }
}

//删除定时循环函数
module.exports.game_removeEventLoopFunc = (handler) =>{
    //查找要删除的函数,如果不存在则返回 -1,否则删除指定元素
    let index = eventFunc.indexOf(handler)
    if(index !== -1){
        eventFunc.splice(index,1)
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