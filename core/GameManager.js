//事件循环是否开启
import {WebSocketServer} from "ws";
import {readdir} from 'fs/promises'
import {fileURLToPath, pathToFileURL} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let eventLoop = false
//事件循环函数存储
let eventFunc = []
//可调用类对象存储
let classMap = {}
//Websocket服务端对象
let ws
//setInterval返回值,可用于关闭循环
let loopResult
// 存储事件和对应的处理函数
let events = {}

//游戏服务管理器
export const GameManager = {
    
    //启动服务器
    run: function () {
        let port = parseInt(process.env.WEBSOCKET_PORT, 10)
        if (!isNaN(port)) {
            // 如果成功解析为整数，则使用该端口创建 WebSocketServer
            ws = new WebSocketServer({port: port})
            console.log('端口解析为:', port, '服务器已启动')
        } else {
            // 如果无法解析为整数，则输出错误信息并结束函数或程序
            console.log('WebSocketServer 端口设置错误: ', process.env.WEBSOCKET_PORT)
            return
        }
        
        ws.on('connection', (ws, req) => {
            
            console.log("用户[" + req.connection.remoteAddress + "] 进入连接");
            
            ws.on('message', (msg) => {
                try {
                    //解析数据
                    console.log('message收到的原始消息', msg.toString())
                    let {className, method, data} = JSON.parse(msg)
                    //调用已注册方法
                    let tag = new Struct(req.connection.remoteAddress, ws, className, method)
                    this.call(tag, className, method, data)
                    
                } catch (e) {
                    console.log(e)
                }
            })
            ws.on('close', () => {
                this.unsubscribe2(ws)
                console.log('close用户断开连接' + req.connection.remoteAddress);
            })
            ws.on('error', (err) => {
                console.log('error用户异常断开' + req.connection.remoteAddress);
                console.log(err);
            })
        })
    },
    
    //注册可调用类
    reg: async function () {
        //使用fs遍历api目录中js文件
        const apiDir = join(__dirname, '..', 'api'); // 根据实际情况修改目录路径
        try {
            const files = await readdir(apiDir);
            for (const file of files) {
                if (file.endsWith('.js')) {
                    const modulePath = pathToFileURL(join(apiDir, file))
                    try {
                        const module = await import(modulePath);
                        // 假设模块中导出了一个类或对象，根据实际情况调整
                        const instance = new module.default(); // 如果是默认导出，或者根据实际情况获取具名导出
                        // 使用 instance 进行你的操作，例如加入一个数组中等
                        classMap[instance.constructor.name] = instance
                        console.log('已加载可调用模块: ', instance.constructor.name)
                    } catch (err) {
                        console.error(`加载可调用模块失败 ${modulePath}:`, err);
                    }
                }
            }
        } catch (e) {
            console.error(e)
        }
    },
    
    //调用类方法且传递参数
    call: function (tag, className, method, data) {
        //判断类方法是否存在
        try {
            if (typeof classMap[className][method] === 'function') {
                //调用类方法传递参数
                classMap[className][method](tag, data)
            }
        } catch (e) {
            console.log('call发生错误:' + e)
        }
    },
    
    //发送消息到客户端
    send: function (tag, data) {
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
    },
    
    //开启事件循环 delay = 间隔毫秒
    openEventLoop: function (delay) {
        //如果已开启则忽略操作
        if (!eventLoop) {
            //限制一下,防止设置过快,1秒60帧约等于16毫秒间隔,可以用了
            delay = delay < 16 ? 16 : delay
            eventLoop = true
            loopResult = setInterval(() => {
                //需要重复执行的函数
                eventFunc.forEach((func) => {
                    func()
                })
            }, delay)
        }
    },
    
    //关闭事件循环
    closeEventLoop: function () {
        //判断循环是否已开启
        if (eventLoop) {
            clearInterval(loopResult)
            eventLoop = false
        }
    },
    
    //添加定时循环函数
    addEventLoopFunc: function (handler) {
        //检查是否已存在,不存在则添加
        if (!eventFunc.includes(handler)) {
            eventFunc.push(handler)
        }
    },
    
    //删除定时循环函数
    removeEventLoopFunc: function (handler) {
        //查找要删除的函数,如果不存在则返回 -1,否则删除指定元素
        let index = eventFunc.indexOf(handler)
        if (index !== -1) {
            eventFunc.splice(index, 1)
        }
    },
    
    // 订阅事件
    subscribe: function (eventName, client) {
        try {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            // 检查是否已经订阅过该客户端，避免重复订阅
            if (!events[eventName].includes(client)) {
                events[eventName].push(client);
            } else {
                console.log('subscribe 客户端已存在,不可重复订阅')
            }
        } catch (e) {
            console.log('subscribe 订阅事件发生错误:' + e)
        }
    },
    
    // 取消订阅事件
    unsubscribe: function (eventName, client) {
        try {
            if (!events[eventName]) return;
            events[eventName] = events[eventName].filter(obj => obj !== client);
        } catch (e) {
            console.log('unsubscribe 取消订阅事件发生错误:', e)
        }
    },
    
    //取消订阅事件2
    unsubscribe2: function (client) {
        try {
            Object.keys(events).forEach(eventName => {
                events[eventName] = events[eventName].filter(obj => obj !== client);
            });
        } catch (e) {
            console.log('unsubscribe2 执行发生错误:' + e)
        }
    },
    
    // 发布事件
    publish: function (eventName, data) {
        try {
            if (!events[eventName]) return;
            console.log('publish 发布事件:', eventName, data)
            
            events[eventName].forEach((client) => {
                client.send(JSON.stringify({
                    eventName: eventName,
                    className: null,
                    method: null,
                    data: data
                }))
            })
        } catch (e) {
            console.log('publish 发布事件发生错误:' + e)
        }
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