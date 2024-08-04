const {MongoClient} = require("mongodb");

let mongodb;
let connected = false;

//连接数据库
module.exports.db_init = async () => {
    if (connected) return; // 如果已经连接，则直接返回
    mongodb = new MongoClient(process.env.MONGODB_CONNECT);
    try {
        await mongodb.connect();
        connected = true;
        console.log("Mongodb Connected");
    } catch (err) {
        console.log(err);
        throw err; // 抛出错误以便调用者可以处理
    }
}

//取集合数据
module.exports.db_get = async (tableName) => {
    try {
        return await mongodb.db(process.env.MONGODB_DBNAME).collection(tableName)
    } catch (err) {
        console.error("Error fetching data from MongoDB:", err);
        throw err; // 抛出错误以便调用者可以处理
    }
}

//关闭数据库
module.exports.db_close = async () => {
    try {
        await mongodb.close();
        connected = false;
    } catch (err) {
        console.log(err);
        // 可以选择在这里重新抛出错误或进行其他处理
    }
}

//创建集合
module.exports.db_createCollection = async (tableName) => {
    try {
        await mongodb.db(process.env.MONGODB_DBNAME).createCollection(tableName)
    } catch (e) {
        console.log(e)
    }
}

//删除集合
module.exports.db_deleteCollection = async (tableName) => {
    try {
        await mongodb.db(process.env.MONGODB_DBNAME).dropCollection(tableName)
    } catch (e) {
        console.log(e)
    }
}

