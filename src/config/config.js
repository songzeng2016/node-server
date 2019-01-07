// config.js
// const host = 'localhost';
const host = '118.25.50.176';
const baseUrl = `mongodb://${host}:27017`;
const dbbase = "/monitor"; // 这里是我的数据库名称哦
const collectionName = 'info'; // 集合名称

module.exports = {
  "dburl": baseUrl + dbbase,
  collectionName,
};