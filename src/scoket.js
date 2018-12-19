const net = require('net');
const {saveImage} = require('./fs');

const server = net.createServer();
// const PORT = 3000;  // 定义端口
const time_out = 5000;  // 定义超时时间

//监听连接事件
server.on('connection', function (socket) {
  const client = socket.remoteAddress + ':' + socket.remotePort;
  console.info('Connected to ' + client);

  let imgData = '';  // 接收数据
  let isComplete = false; // 判断数据是否接收完成

  //监听数据接收事件
  socket.on('data', function (data) {
    console.log('data: ++ ' + data);

    // 判断开始接收数据
    if (/^ffd8/.test(data)) {
      imgData = '';
      isComplete = false;

      setTimeout(() => {  // 设置超时时间
        if (!isComplete) {
          socket.write('no');
        }
      }, time_out);
    }

    imgData += data;
    if (/ffd9$/.test(data)) {
      isComplete = true;
      saveImage(imgData, function (success) {
        if (success) {
          socket.write('yes');
        } else {
          socket.write('no');
        }
      });
    }
  });

  //监听连接断开事件
  socket.on('end', function () {
    console.log('Client disconnected.');
  });
});

// TCP服务器开始监听特定端口
// server.listen(PORT, function () {
//   console.log('socket listen on port: ' + PORT);
// });

module.exports.socket = server;