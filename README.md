# NodeServer-JavaScript

使用前必要操作
----
使用 `webstorm` 或 `VS Code` 等其他编辑器打开项目后 , 首先在控制台运行以下命令安装必要的包  
如果遇到网络问题等无法安装包,可以网上搜索查看网友是如何设置 `npm 国内镜像源`  [如何设置国内镜像源](https://www.cnblogs.com/bigron/p/17486819.html)

```
npm install
```

入口文件介绍
----
服务器入口页:  `index.js` 内执行代码

```
import {GameManager} from "./core/GameManager.js";
import {config} from "dotenv";
//↑↑↑↑↑导入必要的模块↑↑↑↑↑

//↓↓↓↓↓加载 .env 文件中配置信息↓↓↓↓↓(不可删除,必须在最前面执行)
config()

//执行游戏逻辑
GameManager.run()
//批量注册实例
GameManager.reg()
```

通信参数介绍
----
客户端必要提交参数(区分大小写)
字符串格式:

```
//普通消息
{
    className: 类名称, 
    method:方法名称, 
    data:数据
}
//例如
{
    className: User, 
    method:login, 
    data:'你好,我是来自客户端的数据'
}

//订阅消息
{
    className: ServerEventManager, 
    method:addServerEvent, 
    data:
        {
            eventName: 事件名称
        }
}
//取消订阅
{
    className: ServerEventManager, 
    method:removeServerEvent, 
    data:
        {
            eventName: 事件名称
        }
}
```

----------------------------------------------
客户端接收参数(区分大小写)
字符串格式:

```
{
    eventName:事件名称(无事件为0),
    className: 类名称,
    method: 方法名称, 
    data: 数据
}
```

可调用类格式介绍
----
类方法必须两个参数,第一个为tag,第二个为客户端发送过来的消息内容

```
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
```
