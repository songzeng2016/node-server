// db.js
/**
 *  数据库封装
 *
 */

const MongodbClient = require('mongodb').MongoClient;
const config = require('../config/config.js');
const {dburl, collectionName} = config;

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

async function connectDB() {
  const db = await MongodbClient.connect(dburl, {
    useNewUrlParser: true,
  });
  const dbo = db.db('monitor');

  return {
    db,
    dbo,
    collection: dbo.collection(collectionName),
  };
}

async function findOne(json) {
  const {db, collection} = await connectDB();
  const result = await collection.findOne(json);

  // console.log(json);
  // console.log(result);

  db.close();
  return result;
}

async function updateOne(json, data) {
  const {db, collection} = await connectDB();
  const result = await collection.updateOne(json, {$set: data});

  db.close();
  return result;
}

module.exports = {
  findOne,
  updateOne,
};
// db.js 文件是数据库操作的DAO 层的封装
