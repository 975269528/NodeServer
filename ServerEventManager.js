//服务器事件管理器
const ServerEvent = {
    events: {},  // 存储事件和对应的处理函数
    
    // 订阅事件
    subscribe: function (eventName, client) {
        try {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            // 检查是否已经订阅过该客户端，避免重复订阅
            if (!this.events[eventName].includes(client)) {
                this.events[eventName].push(client);
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
            if (!this.events[eventName]) return;
            this.events[eventName] = this.events[eventName].filter(obj => obj !== client);
        } catch (e) {
            console.log('unsubscribe 取消订阅事件发生错误:', e)
        }
    },
    
    //取消订阅事件2
    unsubscribe2: function (client) {
        try {
            Object.keys(this.events).forEach(eventName => {
                this.events[eventName] = this.events[eventName].filter(obj => obj !== client);
            });
        } catch (e) {
            console.log('unsubscribe2 执行发生错误:' + e)
        }
    },
    
    // 发布事件
    publish: function (eventName, data) {
        try {
            if (!this.events[eventName]) return;
            console.log('publish 发布事件:', eventName, data)
            
            this.events[eventName].forEach((client) => {
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
};

class ServerEventManager {
    constructor() {
    }
    
    //添加订阅事件
    addServerEvent(tag, eventName) {
        let name = eventName.eventName
        console.log(tag.fromUser, " addServerEvent订阅消息事件:" + name)
        ServerEvent.subscribe(name, tag.ws)
    }
    
    //移除订阅事件
    removeServerEvent(tag, eventName) {
        let name = eventName.eventName
        console.log(tag.fromUser, " removeServerEvent取消订阅消息事件:" + name)
        ServerEvent.unsubscribe(name, tag.ws)
    }
    
}

module.exports = {
    //服务器事件管理器,提供订阅,取消订阅,发布事件 功能
    ServerEventManager: ServerEventManager,
    ServerEvent: ServerEvent
}