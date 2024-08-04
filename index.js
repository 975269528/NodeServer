const {game_run, game_reg, game_call, game_openEventLoop, game_addEventLoopFunc} = require("./core/Game");
const {User} = require("./api/User");
const {ServerEventManager} = require("./core/ServerEventManager");

//启动服务器
game_run()

//开启事件循环
game_openEventLoop(500)

//添加事件循环函数
game_addEventLoopFunc(function () {
    console.log('测试循环执行')
})

//注册事件管理器
game_reg(new ServerEventManager())

//注册用户操作类
game_reg(new User())


