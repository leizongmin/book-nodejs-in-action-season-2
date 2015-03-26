/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var bodyParser = require('body-parser');
var connect = require('connect');
var multipart = require('connect-multiparty');
var utils = require('./utils');
var database = require('./database');


// 检查用户是否已登录
exports.ensureLogin = function (req, res, next) {
  // 这里直接设置用户ID=glen
  req.loginUserId = 'glen';
  next();
};


// 解析请求Body部分
var postBody = connect();
postBody.use(bodyParser.json());
postBody.use(bodyParser.urlencoded({extended: true}));
postBody.use(multipart());
exports.postBody = postBody;


// 扩展 res.apiSuccess() 和 res.apiError()
exports.extendAPIOutput = function (req, res, next) {

  // 响应API成功结果
  res.apiSuccess = function (data) {
    res.json({
      status: 'OK',
      result: data
    });
  };

  // 响应API出错结果，err是一个Error对象，
  // 包含两个属性：error_code和error_message
  res.apiError = function (err) {
    res.json({
      status: 'Error',
      error_code: err.error_code || 'UNKNOWN',
      error_message: err.error_message || err.toString()
    });
  };

  next();
};


// 统一处理API出错信息
exports.apiErrorHandle = function (err, req, res, next) {
  console.error((err && err.stack) || err.toString());

  // 如果有res.apiError()则使用其来输出出错信息
  if (typeof res.apiError === 'function') {
    return res.apiError(err);
  }

  next();
};


// 验证access_token
exports.verifyAccessToken = function (req, res, next) {
  var token = req.body.access_token || req.query.access_token;
  var appKey = req.body.client_id || req.query.client_id;

  // 查询access_token的信息
  database.getAccessTokenInfo(token, function (err, tokenInfo) {
    if (err) return next(err);

    // 检查appKey是否一致
    if (req.body.client_id !== tokenInfo.appKey) {
      return next(utils.invalidParameterError('client_id'));
    }

    // 保存当前access_token的详细信息
    req.accessTokenInfo = tokenInfo;

    next();
  });
};
