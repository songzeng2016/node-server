/* express的服务器 */

//1. 导入express
var express = require('express')

//2. 创建express服务器
var server = express()

server.use(express.static('static'));

//3. 访问服务器(get或者post)
//参数一: 请求根路径
//3.1 get请求
server.get('/api', function (request, response) {
  // console.log(request)
  response.send('get请求成功')
})

server.get('/upload/image', function (request, response) {
  // console.log(request)
  response.send('上传图片成功')
  console.log(request.query);
  // console.log(response);
})

//3.2 post请求
// server.post('/', function (request, response) {
//   response.send('post请求成功')
// })

//4. 绑定端口
server.listen(8080)
console.log('启动8080')