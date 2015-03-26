/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var bodyParser = require('body-parser');
var connect = require('connect');
var multipart = require('connect-multiparty');


// 检查用户是否已登录
exports.ensureLogin = function (req, res, next) {
  req.loginUserId = 'glen';
  next();
};

// 解析请求Body部分
var postBody = connect();
postBody.use(bodyParser.json());
postBody.use(bodyParser.urlencoded({extended: true}));
postBody.use(multipart());
exports.postBody = postBody;

