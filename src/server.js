const express = require('express');
const net = require('net');
const db = require('./model/db');
const {saveImage, saveTxt} = require('./fs');

const app = express();
const socket = net.createServer();

const express_port = 8080;  // 定义端口
const socket_port = 3000;
const time_out = 10000;  // 定义超时时间

const sockets = [];  // 存储所有客户端 socket

let currentSocket;


// 更新图片列表
async function updateImage(imageName) {
  const json = {name: 'image'};

  const result = await db.findOne(json);
  const list = result.value;
  list.push(imageName);
  const data = {
    ...json,
    value: list,
  };

  return db.updateOne(json, data);
}

//监听连接事件
socket.on('connection', function (socket) {
  const client = socket.remoteAddress + ':' + socket.remotePort;
  console.info('Connected to ' + client);

  // sockets.push(socket);
  currentSocket = socket;

  let imgData = '';  // 接收数据
  let isComplete = false; // 判断数据是否接收完成

  //监听数据接收事件
  socket.on('data', function (data) {
    console.log('data: ++ ' + data);

    // 心跳数据
    if (data == 'fefe') {
      console.log('heart');
      socket.write(data);
    }

    // 判断开始接收数据
    if (/^(ffd8|FFD8)/.test(data)) {
      imgData = '';
      isComplete = false;

      setTimeout(() => {  // 设置超时时间
        if (!isComplete) {
          console.log('no');
          console.log(imgData.length);
          socket.write('no');
        }
      }, time_out);
    }

    imgData += data;
    if (/(ffd9|FFD9)/.test(data)) {
      isComplete = true;
      saveImage(imgData, function (imageName) {
        if (imageName) {
          updateImage(imageName).then(() => {
            console.log('yes');
            console.log(imgData.length);
            socket.write('yes');
          });
        } else {
          console.log('save image error no');
          socket.write('no');
        }
      });
      saveTxt(imgData, function (success) {

      });
    }
  });

  //监听连接断开事件
  socket.on('end', function () {
    // const index = sockets.indexOf(socket);
    // sockets.splice(index, 1);

    currentSocket = '';

    console.log('Client disconnected.');
  });
});

// 设置静态资源路径
app.use(express.static('../static'));

app.get('/uploadImage', function (req, res) {
  const json = {name: 'image'};
  db.findOne(json).then(result => {
    const list = result.value;
    list.push(Date.now() + '.png');
    const data = {
      ...json,
      value: list,
    };

    db.updateOne(json, data).then(result => {
      res.send({
        code: 200,
        data: result,
      });
    });
  });
});

// 获取图片里列表
app.get('/getImage', function (req, res) {
  const json = {name: 'image'};
  db.findOne(json).then(result => {
    res.send({
      code: 200,
      data: result,
    });
  });
});

// 获取信息
app.get('/getInfo', function (req, res) {
  const {type} = req.query;
  const json = {name: type};

  db.findOne(json).then(result => {
    res.send({
      code: 200,
      data: result,
    });
  });
});

// 设置信息
app.get('/setInfo', function (req, res) {
  let {type, value} = req.query;
  const json = {name: type};
  const data = {
    ...json,
    value,
  };

  db.updateOne(json, data).then(result => {
    let prefix = '';
    // prefix = type === 'phone' ? '$' :
    //     type === 'name' ? '.' : ',';
    switch (type) {
      case 'phone':
        prefix = '$';
        break;
      case 'name':
        prefix = '#';
        break;
      case 'password':
        prefix = ',';
        break;
      case 'ip':
        prefix = '@';
        break;
      case 'mode':
        prefix = value;
        value = '';
        break;
    }
    // 发送消息给客户端
    // sockets.forEach(socket => {
    //   console.log(prefix + value);
    //   try {
    //     socket.write(prefix + value);
    //   } catch {
    //     console.log('write error');
    //   }
    // });
    if (currentSocket) {
      console.log(prefix + value);
      currentSocket.write(prefix + value);
    }
    res.send({
      code: 200,
      data: result,
    });
  });
});

// express 服务器开始监听特定端口
app.listen(express_port, function () {
  console.log('express listen on port: ' + express_port);
});

// socket 服务器开始监听特定端口
socket.listen(socket_port, function () {
  console.log('socket listen on port: ' + socket_port);
});
