/**
 * 简单API服务器
 * 这是个简单服务器么，这就是一系列的connect中间件
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var parseUrl = require('url').parse;
var redis = require('redis'); // 连接redis
var bodyParser = require('body-parser');
var connect = require('connect');
var multipart = require('connect-multiparty');
var js2xmlparser = require('js2xmlparser');
var utils = require('./utils');
var database = require('./database');


// 检查用户是否已登录
exports.ensureLogin = function (req, res, next) {
  // 这里直接设置用户ID=glen
  req.loginUserId = 'glen';
  next(); // 跳转到下一个符合的路由
};


// 解析请求Body部分
var postBody = connect();
postBody.use(bodyParser.json());
postBody.use(bodyParser.urlencoded({extended: true}));
postBody.use(multipart());
exports.postBody = postBody;


// 扩展 res.apiSuccess() 和 res.apiError()
// response对象是connect库的
exports.extendAPIOutput = function (req, res, next) {

  // 输出数据
  function output (data) {

    // 取得请求的数据格式
    var type = path.extname(parseUrl(req.url).pathname);  // 获取扩展名
    if (!type) type = '.' + req.accepts(['json', 'xml']); // 设置接受扩展名json/xml
    switch (type) { // 处理xml/json的数据
      case '.xml':
        return res.xml(data);
      default:
        return res.json(data);
    }
  }

  // 响应API成功结果
  res.apiSuccess = function (data) {
    output({
      status: 'OK',
      result: data
    });
  };

  // 响应API出错结果，err是一个Error对象，
  // 包含两个属性：error_code和error_message
  res.apiError = function (err) {
    output({
      status: 'Error',
      error_code: err.error_code || 'UNKNOWN',
      error_message: err.error_message || err.toString()
    });
  };

  // 输出XML格式数据
  res.xml = function (data) {
    res.setHeader('content-type', 'text/xml');
    res.end(js2xmlparser('data', data));
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
  var accessToken = (req.body && req.body.access_token) || req.query.access_token; // 获取access_token
  var source = (req.body && req.body.source) || req.query.source; // 拿到访问资源

  // 检查参数
  if (!accessToken) return next(utils.missingParameterError('access_token')); // 缺少参数
  if (!source) return next(utils.missingParameterError('source'));  // 缺少参数

  // 查询access_token的信息
  // 数据库里拿到AccessTokenInfo，然后对比clientId是不惠一致的
  database.getAccessTokenInfo(accessToken, function (err, tokenInfo) {
    if (err) return next(err);

    // 检查appKey是否一致
    if (source !== tokenInfo.clientId) {
      return next(utils.invalidParameterError('source'));
    }

    // 保存当前access_token的详细信息
    req.accessTokenInfo = tokenInfo;  //从数据库获取的token

    next();
  });
};


//------------------------------------------------------------------------------

// 连接的redis
var redisClient = redis.createClient('32768', '192.168.99.100', {no_ready_check: true});

// 生成检测请求频率的中间件
exports.generateRateLimiter = function (getKey, limit) {
  return function (req, res, next) {

    var source = (req.body && req.body.source) || req.query.source;
    var key = getKey(source);

    redisClient.incr(key, function (err, ret) {
      if (err) return next(err);
      if (ret > limit) return next(utils.outOfRateLimitError());

      next();
    });
  };
};
