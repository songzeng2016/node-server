var net = require('net');   //引入网络模块
var HOST = '127.0.0.1';     //定义服务器地址
// var HOST = '118.25.50.176';     //定义服务器地址
var PORT = 3000;            //定义端口号

//创建一个TCP客户端实例
var client = net.connect(PORT, HOST, function() {
  console.log('Connected to the server.');
  // client.write('Hello Server!');
  let data = JSON.stringify([1, 2, 3]);
  let message = 'ffd8asdfsafdsaffd9';
  client.write(message);
});

//监听数据传输事件
client.on('data', function(data) {
  console.log(data.toString());
  // client.end();
});

//监听连接关闭事件
client.on('end', function() {
  console.log('Server disconnected.');
});