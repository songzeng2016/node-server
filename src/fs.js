const fs = require('fs');

module.exports.saveImage = function (data, callback) {
  const dataBuffer = Buffer.from(data, 'hex');
  fs.writeFile('../static/images/image1.png', dataBuffer, function (err) {
    if (err) {
      // res.send(err);
      callback(0);
    } else {
      // res.send('保存成功！');
      callback(1);
    }
  });
};

module.exports.saveTxt = function (data, callback) {
  fs.writeFile('../static/images/txt.txt', data, function (err) {
    if (err) {
      // res.send(err);
      // callback(0);
    } else {
      // res.send('保存成功！');
      // callback(1);
    }
  });
};