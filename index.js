const {game_run, game_reg, game_call} = require("./core/Game");
const {User} = require("./api/User");
const {ServerEventManager} = require("./core/ServerEventManager");


game_run()

game_reg(new ServerEventManager())

game_reg(new User())


