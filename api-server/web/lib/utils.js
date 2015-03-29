/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var clone = require('clone');
var parseUrl = require('url').parse;
var formatUrl = require('url').format;

var utils = module.exports = exports = clone(require('lei-utils'));


// 将参数添加到URL
utils.addQueryParamsToUrl = function (url, params) {
  var info = parseUrl(url, true);
  for (var i in params) {
    info.query[i] = params[i];
  }
  delete info.search;
  return formatUrl(info);
};

// 如果数值不大于0则返回默认值
utils.defaultNumber = function (n, d) {
  n = Number(n);
  return n > 0 ? n : d;
};

// 创建出错对象，code=出错代码，msg=出错描述信息
utils.createApiError = function (code, msg) {
  var err = new Error(msg);
  err.error_code = code;
  err.error_message = msg;
  return err;
};

// 缺少参数错误
utils.missingParameterError = function (name) {
  return utils.createApiError('MISSING_PARAMETER', '缺少参数`' + name + '`');
};

// 回调地址不正确错误
utils.redirectUriNotMatchError = function (url) {
  return utils.createApiError('REDIRECT_URI_NOT_MATCH', '回调地址不正确：' + url);
};

// 参数错误
utils.invalidParameterError = function (name) {
  return utils.createApiError('INVALID_PARAMETER', '参数`' + name + '`不正确');
};

// 超出请求频率限制错误
utils.outOfRateLimitError = function () {
  return utils.createApiError('OUT_OF_RATE_LIMIT', '超出请求频率限制');
};
