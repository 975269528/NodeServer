# NodeServer

入口文件介绍
----
服务器入口页:  `index.js` 内执行代码
```javascript
//启动服务器
game_run()

//注册客户端可调用类实例↓↓↓↓↓

//事件管理类(必须)
game_reg(new ServerEventManager())

//可选:User用户管理类
game_reg(new User())
```
通信参数介绍
----
客户端必要提交参数(区分大小写) 
字符串格式: 
```javascript
//普通消息
{className: 类名称, method: 方法名称, data: 数据}
//例如
{className: User, method: login, data: '你好,我是来自客户端的数据'}

//订阅消息
{className: ServerEventManager, method: addServerEvent, data: {eventName: 事件名称}}
//取消订阅
{className: ServerEventManager, method: removeServerEvent, data: {eventName: 事件名称}}
```
----------------------------------------------
客户端接收参数(区分大小写)
字符串格式:
```javascript
{eventName:事件名称(无事件为0), className:类名称,method:方法名称, data:数据}
```

可调用类格式介绍
----
类方法必须两个参数,第一个为tag,第二个为客户端发送过来的消息内容
```javascript
class User {
    constructor() {
    }
    
    login(tag, data) {
        console.log("login客户端消息:" + data)
        //发送消息到客户端
        game_send(tag, data)
        //测试订阅推送
        //ServerEvent.publish('test', '你好,我是测试订阅回调的,你收到了吗?')
    }
}
//导出类
module.exports = {
    User: User
}
```
