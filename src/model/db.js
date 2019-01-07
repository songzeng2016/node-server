// db.js
/**
 *  数据库封装
 *
 */

const MongodbClient = require('mongodb').MongoClient;
const config = require('../config/config.js');
const {dburl, collectionName} = config;

/**
 * 连接数据库
 */

function __connectDB(callback) {
  MongodbClient.connect(dburl, function (err, db) {
    callback(err, db, db.db('monitor'));
  });
}

/**
 * 插入一条数据
 * @param {*} collectionName 集合名
 * @param {*} Datajson 写入的json数据
 * @param {*} callback 回调函数
 */
function __insertOne(Datajson, callback) {
  __connectDB(function (err, db, dbo) {
    var collection = dbo.collection(collectionName);
    collection.insertOne(Datajson, function (err, result) {
      callback(err, result); // 通过回调函数上传数据
      db.close();
    })
  })
}

/**
 * 查找数据
 * @param {*} collectionName 集合名
 * @param {*} Datajson 查询条件
 * @param {*} callback 回调函数
 */

function __findOne(JsonObj, callback) {
  __connectDB(function (err, db, dbo) {
    // console.log(db);
    var result = dbo.collection(collectionName).findOne(JsonObj);
    console.log(result);
    callback(err, result);
    db.close();
  });
}

module.exports = {
  __connectDB,
  __insertOne,
  __findOne,
};
// db.js 文件是数据库操作的DAO 层的封装