/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var utils = require('./utils');


// 获取App信息
exports.getClientInfoById = function (id, callback) {
  callback(null, {
    id: id,
    name: 'Node.js实战',
    description: '专注Node.js实战二十年'
  });
};


// 生成授权Code
var grantCodes = [];
exports.generateGrantCode = function (clientId, userId, callback) {
  var code = utils.randomString(20);
  grantCodes.push({
    clientId: clientId,
    userId: userId,
    code: code
  });
  callback(null, code);
};
