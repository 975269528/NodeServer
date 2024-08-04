const {game_send} = require("../core/Game");
const {ServerEvent} = require("../core/ServerEventManager");

class User {
    constructor() {
    }
    
    login(tag, data) {
        console.log("login客户端消息:" + data)
        //发送消息到客户端
        game_send(tag, data)
        //测试订阅推送
        ServerEvent.publish('test', '你好,我是测试订阅回调的,你收到了吗?')
    }
}

//导出类
module.exports = {
    User: User
}