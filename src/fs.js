const fs = require('fs');

module.exports.saveImage = function (data, callback) {
  const dataBuffer = Buffer.from(data, 'hex');
  const name = Date.now() + '.png';
  fs.writeFile('../static/images/' + name, dataBuffer, function (err) {
    if (err) {
      // res.send(err);
      callback(0);
    } else {
      // res.send('保存成功！');
      callback(name);
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