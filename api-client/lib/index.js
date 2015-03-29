/**
 * 简单API客户端
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var parseUrl = require('url').parse;
var formatUrl = require('url').format;
var request = require('request');



function addQueryParamsToUrl (url, params) {
  var info = parseUrl(url, true);
  for (var i in params) {
    info.query[i] = params[i];
  }
  delete info.search;
  return formatUrl(info);
}



// 定义请求API的地址
var API_URL = 'http://127.0.0.1:3000';
var API_OAUTH2_AUTHORIZE = API_URL + '/OAuth2/authorize';
var API_OAUTH2_ACCESS_TOKEN = API_URL + '/OAuth2/access_token';
var API_ARTICLES = API_URL + '/api/v1/articles.json';


function APIClient (options) {
  this._appKey = options.appKey;
  this._appSecret = options.appSecret;
  this._callbackUrl = options.callbackUrl;
}

// 生成获取授权的跳转地址
APIClient.prototype.getRedirectUrl = function () {
  return addQueryParamsToUrl(API_OAUTH2_AUTHORIZE, {
    client_id: this._appKey,
    redirect_uri: this._callbackUrl
  });
};

// 发送请求
APIClient.prototype._request = function (method, url, params, callback) {
  method = method.toUpperCase();

  // 如果已经获取了access_token，则字加上source和access_token两个参数
  if (this._accessToken) {
    params.source = this._appKey;
    params.access_token = this._accessToken;
  }

  // 根据不同的请求方法，生成用于request模块的参数
  var requestParams = {
    method: method,
    url: url
  };
  if (method === 'GET' || method === 'HEAD') {
    requestParams.qs = params;
  } else {
    requestParams.formData = params;
  }

  request(requestParams, function (err, res, body) {
    if (err) return callback(err);

    // 解析返回的数据
    try {
      var data = JSON.parse(body.toString());
    } catch (err) {
      return callback(err);
    }

    // 判断是否出错
    if (data.status !== 'OK') {
      return callback({
        code: data.error_code,
        message: data.error_message
      });
    }

    callback(null, data.result);
  });
};

// 获取access_token
APIClient.prototype.requestAccessToken = function (code, callback) {
  var me = this;
  this._request('post', API_OAUTH2_ACCESS_TOKEN, {
    code: code,
    client_id: this._appKey,
    client_secret: this._appSecret,
    redirect_uri: this._callbackUrl
  }, function (err, ret) {
    // 如果请求成功则保存获取得的access_token
    if (ret) me._accessToken = ret.access_token;
    callback(err, ret);
  });
};

// 查询文章列表
APIClient.prototype.getArticles = function (params, callback) {
  this._request('get', API_ARTICLES, params, callback);
};

module.exports = APIClient;
