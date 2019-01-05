const express = require('express');
const net = require('net');
const {saveImage} = require('./fs');

const app = express();
const socket = net.createServer();

const express_port = 8080;  // 定义端口
const socket_port = 3000;
const time_out = 5000;  // 定义超时时间

const sockets = [];  // 存储所有客户端 socket

//监听连接事件
socket.on('connection', function (socket) {
  const client = socket.remoteAddress + ':' + socket.remotePort;
  console.info('Connected to ' + client);

  sockets.push(socket);

  let imgData = '';  // 接收数据
  let isComplete = false; // 判断数据是否接收完成

  //监听数据接收事件
  socket.on('data', function (data) {
    console.log('data: ++ ' + data);

    // 判断开始接收数据
    if (/^ffd8/.test(data)) {
      imgData = data;
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
    const index = sockets.indexOf(socket);
    sockets.splice(index, 1);

    console.log('Client disconnected.');
  });
});

// 设置静态资源路径
app.use(express.static('../static'));

app.get('/getImage', function (request, response) {
  // console.log(request)
  response.send('get请求成功');
});

app.get('/set', function (req, res) {
  console.log(req.query);
  // console.log(response);

  res.send({
    code: 200,
    data: {},
  });
});

app.get('/setPhone', function (request, response) {
  sockets.forEach(socket => {
    socket.write('$phone');
  });
  response.send('get请求成功');
});

app.listen(express_port, function () {
  console.log('express listen on port: ' + express_port);
});

// TCP服务器开始监听特定端口
socket.listen(socket_port, function () {
  console.log('socket listen on port: ' + socket_port);
});