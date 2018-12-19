const express = require('express');
const {socket} = require('./scoket');

const express_port = 8080;  // 定义端口
const socket_port = 3000;
const app = express();

// 设置静态资源路径
app.use(express.static('../static'));

app.get('/getImage', function (request, response) {
  // console.log(request)
  response.send('get请求成功');
});

app.listen(express_port, function () {
  console.log('express listen on port: ' + express_port);
});

// TCP服务器开始监听特定端口
socket.listen(socket_port, function () {
  console.log('socket listen on port: ' + socket_port);
});