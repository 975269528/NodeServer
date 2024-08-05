import {GameManager} from "../core/GameManager.js";

export default class User {
    constructor() {
    }
    
    login(tag, data) {
        console.log("login客户端消息:" + data)
        //发送消息到客户端
        //GameManager.send(tag, '你好,我是服务器返回的消息')
        //测试推送订阅事件
        //GameManager.publish('test', '这些订阅事件推送的内容')
    }
}

