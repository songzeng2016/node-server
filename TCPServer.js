var net = require('net')    //引入网络模块
var HOST = '127.0.0.1';     //定义服务器地址
var PORT = 3000;            //定义端口号

console.info('Server is running on port ' + PORT);
var server = net.createServer();

//监听连接事件
server.on('connection', function(socket) {
  var client = socket.remoteAddress + ':' + socket.remotePort;
  console.info('Connected to ' + client);

  //监听数据接收事件
  socket.on('data', function(data) {
    console.log('data: ++ ' + data);
    socket.write('Hello Client!');
  });

  //监听连接断开事件
  socket.on('end', function() {
    console.log('Client disconnected.');
  });
});

//TCP服务器开始监听特定端口
server.listen(PORT);