const {game_run, game_reg, game_call} = require("./Game");
const {User} = require("./User");
const {ServerEventManager} = require("./ServerEventManager");


game_run()

game_reg(new ServerEventManager())

game_reg(new User())


