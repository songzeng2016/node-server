var net = require('net')    //引入网络模块
var HOST = '127.0.0.1';     //定义服务器地址
var PORT = 3000;            //定义端口号

console.info('Server is running on port ' + PORT);
var server = net.createServer();

//监听连接事件
server.on('connection', function(socket) {
  var client = socket.remoteAddress + ':' + socket.remotePort;
  console.info('Connected to ' + client);
  let imgData = '';
  let time = 0;
  let timer = null;
  let success = false;

  //监听数据接收事件
  socket.on('data', function(data) {
    console.log('data: ++ ' + data);
    if (/^ffd8/.test(data)) {
      imgData = '';
      time = 0;
      success = false;
      timer = setInterval(() => {
        time++;
      }, 1000);
      setTimeout(() => {
        if (!success) {
          clearInterval(timer);
          console.log('error:', imgData);
          socket.write('no');
        }
      }, 5000);
    }
    imgData += data;
    if (/ffd9$/.test(data)) {
      timer && clearInterval(timer);
      console.log('success:', imgData);
      success = true;
      socket.write('yes');
    }
    // socket.write(data);
  });

  //监听连接断开事件
  socket.on('end', function() {
    timer && clearInterval(timer);
    console.log('Client disconnected.');
  });
});

//TCP服务器开始监听特定端口
server.listen(PORT);