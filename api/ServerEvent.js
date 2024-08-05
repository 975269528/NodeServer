import {GameManager} from "../core/GameManager.js";

//供客户端订阅事件使用
export default class ServerEvent {
    constructor() {
    }
    
    //添加订阅事件
    addServerEvent(tag, eventName) {
        let name = eventName.eventName
        console.log(tag.fromUser, " addServerEvent订阅消息事件:" + name)
        GameManager.subscribe(name, tag.ws)
    }
    
    //移除订阅事件
    removeServerEvent(tag, eventName) {
        let name = eventName.eventName
        console.log(tag.fromUser, " removeServerEvent取消订阅消息事件:" + name)
        GameManager.unsubscribe(name, tag.ws)
    }
}
