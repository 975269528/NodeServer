import {GameManager} from "./core/GameManager.js";
import {config} from "dotenv";

//加载 .env 文件中配置信息
config()

//执行游戏逻辑
GameManager.run()
//批量注册实例
GameManager.reg()

